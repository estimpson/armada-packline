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

const initilizeApi = async () => {
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
    apiDetails.exeArgs = [
        '--urls',
        `https://localhost:${apiDetails.port}`,
        '--signingkey',
        apiDetails.signingKey,
    ];
    apiDetails.cwd = path.join(
        __dirname.replace('app.asar', 'app.asar.unpacked'),
        '..',
        DOTNET_DIST_FOLDER,
    );

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
        initilizeApi()
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
