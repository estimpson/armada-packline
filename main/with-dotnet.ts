import childProcess from 'child_process';
import crossSpawn from 'cross-spawn';
import { app, dialog, ipcMain } from 'electron';
import getPort from 'get-port';
import * as path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const DOTNET_SUFFIX =
    process.platform === 'win32'
        ? 'win'
        : process.platform === 'darwin'
        ? 'osx'
        : process.platform === 'linux'
        ? 'ubuntu'
        : 'unknown';
const DOTNET_DIST_FOLDER = 'dotnet-' + DOTNET_SUFFIX;
const DOTNET_FOLDER = 'dotnet';
const DOTNET_BASENAME = 'api';
const isDev = !app.isPackaged;

const apiDetails = {
    port: 0,
    signingKey: '',
    exePath: '',
    exeArgs: [''],
    cwd: '',
    log: '',
    process: null as any,
};

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const initializeApi = async () => {
    // Get an avilable port for the dotnet API (production only) or use the development port
    apiDetails.port = isDev ? 5000 : await getPort();
    // Use a signing key to secure the dotnet API
    apiDetails.signingKey = isDev ? 'devKey' : uuidv4();

    const srcPath = path.join(
        __dirname,
        '..',
        DOTNET_FOLDER,
        DOTNET_BASENAME + '.csproj',
    );

    apiDetails.exePath =
        process.platform === 'win32'
            ? path.join(
                  __dirname.replace('app.asar', 'app.asar.unpacked'),
                  '..',
                  DOTNET_DIST_FOLDER,
                  DOTNET_BASENAME + '.exe',
              )
            : path.join(__dirname, DOTNET_DIST_FOLDER, DOTNET_BASENAME);
    console.log(`EXE path: ${apiDetails.exePath}`);

    apiDetails.exeArgs = [
        '--urls',
        `https://localhost:${apiDetails.port}`,
        '--signingkey',
        apiDetails.signingKey,
    ];
    console.log(`EXE args: ${apiDetails.exeArgs}`);

    apiDetails.cwd = path.join(
        __dirname.replace('app.asar', 'app.asar.unpacked'),
        '..',
        DOTNET_DIST_FOLDER,
    );
    console.log(`EXE cwd: ${apiDetails.cwd}`);

    if (__dirname.indexOf('app.asar') > 0) {
        if (fs.existsSync(apiDetails.exePath)) {
            apiDetails.process = childProcess.execFile(
                apiDetails.exePath,
                apiDetails.exeArgs,
                {
                    windowsHide: false,
                    cwd: apiDetails.cwd,
                },
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                        console.log(stderr);
                    }
                },
            );
            if (apiDetails.process === undefined) {
                apiDetails.log += 'dotnetProc is undefined\r\n';
                dialog.showErrorBox('Error', 'dotnetProc is undefined');
            } else if (apiDetails.process === null) {
                apiDetails.log += 'dotnetProc is null\r\n';
                dialog.showErrorBox('Error', 'dotnetProc is null');
            }
        } else {
            apiDetails.log += 'Packaged dotnet app not found\r\n';
            dialog.showErrorBox('Error', 'Packaged dotnet app not found');
        }
    } else {
        // dialog.showErrorBox("info", "unpackaged");
        if (fs.existsSync(srcPath)) {
            apiDetails.process = crossSpawn('dotnet', [
                'run',
                '-p',
                srcPath,
                '--',
                '--urls',
                `https://localhost:${apiDetails.port}`,
                '--signingkey',
                apiDetails.signingKey,
            ]);
        } else {
            apiDetails.log += 'Unpackaged dotnet source not found\r\n';
            dialog.showErrorBox('Error', 'Unpackaged dotnet source not found');
        }
    }
    if (apiDetails.process === null || apiDetails.process === undefined) {
        apiDetails.log += 'unable to start dotnet server\r\n';
        dialog.showErrorBox('Error', 'unable to start dotnet server');
    } else {
        apiDetails.log += `Server running at https://localhost:${apiDetails.port}\r\n`;
        console.log(`Server running at https://localhost:${apiDetails.port}`);

        console.log(`Ping server`);
        const https = require('https');
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        const axios = require('axios');
        const headers = {
            'x-signing-key': apiDetails.signingKey,
            'Content-Type': 'application/json',
        };
        const client = axios.create({
            headers: headers,
            httpsAgent: httpsAgent,
        });
        const url = `https://localhost:${apiDetails.port}/home/ping`;

        var i = 20;
        do {
            let response = await client
                .get(url)
                .then((res: any) => {
                    console.log(`reached server`);
                    return 'SUCCESS';
                    // console.log(res);
                })
                .catch((error: any) => {
                    console.log('failed to reach server');
                    // console.log(error);
                    return 'FAILURE';
                });
            if (response === 'FAILURE') await sleep(2000);
            else break;
            i--;
        } while (i > 0);
        if (i === 0) throw new Error('Failure initiating API');
    }
    apiDetails.log += 'leaving initializeApi()';
    console.log('leaving initializeApi()');
};

// dotnet API is initialized on the first request
ipcMain.on('get-api-details', (event) => {
    console.log('Get API Details');
    if (apiDetails.signingKey !== '') {
        console.log('Get API Details');
        event.sender.send('api-details', JSON.stringify(apiDetails));
    } else {
        initializeApi()
            .then(() => {
                event.sender.send('api-details', JSON.stringify(apiDetails));
            })
            .catch(() => {
                event.sender.send(
                    'api-details-error',
                    'Error initializing API',
                );
            });
    }
});
