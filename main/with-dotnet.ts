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

let dotnetProc = null as any;

const apiDetails = {
    port: 0,
    signingKey: '',
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

    const exePath =
        process.platform === 'win32'
            ? path.join(
                  __dirname.replace('app.asar', 'app.asar.unpacked'),
                  '..',
                  DOTNET_DIST_FOLDER,
                  DOTNET_BASENAME + '.exe',
              )
            : path.join(__dirname, DOTNET_DIST_FOLDER, DOTNET_BASENAME);

    if (__dirname.indexOf('app.asar') > 0) {
        if (fs.existsSync(exePath)) {
            dotnetProc = childProcess.execFile(
                exePath,
                [
                    '--urls',
                    `https://localhost:${apiDetails.port}`,
                    '--signingkey',
                    apiDetails.signingKey,
                ],
                { windowsHide: false },
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(error);
                        console.log(stderr);
                    }
                },
            );
            if (dotnetProc === undefined) {
                dialog.showErrorBox('Error', 'dotnetProc is undefined');
            } else if (dotnetProc === null) {
                dialog.showErrorBox('Error', 'dotnetProc is null');
            }
        } else {
            dialog.showErrorBox('Error', 'Packaged dotnet app not found');
        }
    } else {
        // dialog.showErrorBox("info", "unpackaged");
        if (fs.existsSync(srcPath)) {
            dotnetProc = crossSpawn('dotnet', [
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
            dialog.showErrorBox('Error', 'Unpackaged dotnet source not found');
        }
    }
    if (dotnetProc === null || dotnetProc === undefined) {
        dialog.showErrorBox('Error', 'unable to start dotnet server');
    } else {
        console.log(`Server running at https://localhost:${apiDetails.port}`);
    }
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
