import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from './bootstrap';
import { ApplicationError } from './components/layout/ApplicationError';
import { Footer } from './components/layout/Footer';
import { MainMenu } from './components/layout/Menu';
import { Routes } from './routes';
import { store } from './app/store';
import { localApiInitialized } from './features/localApi/localApiSlice';
import {
    applicationErrorOccurred,
    ApplicationErrorType,
} from './features/applicationError/applicationErrorSlice';
import { useAppDispatch } from './app/hooks';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRef } from 'react';
import { newScan } from './features/barcodeScanner/barcodeScannerSlice';
import { ApplicationNotification } from './components/layout/ApplicationNotification';
import { logout } from './features/identity/identitySlice';
export { default as logo } from './icon.png';

declare const window: Window &
    typeof globalThis & {
        electron?: {
            versions: {
                node: string;
            };
            send: (channel: string, data?: any) => void;
            receive: (channel: string, func: any) => void;
        };
    };

let electron = window?.electron;

if (electron) {
    electron.receive('system-idle', (_: void) => {
        console.log('system-idle');
        store.dispatch(logout());
    });
    electron.receive('api-details', (data: string) => {
        console.log(`Received ${data} about dotnet api`);
        store.dispatch(localApiInitialized(JSON.parse(data)));
    });
    electron.receive('api-details-error', (err: string) => {
        console.log(
            `Received ${err ? err : '[no error details]'} about dotnet api`,
        );
        store.dispatch(
            applicationErrorOccurred({
                type: ApplicationErrorType.Unknown,
                message: `An unexpected error has occured trying to intialize the local API ${
                    err ? err : '[no error details]'
                }`,
            }),
        );
    });
    electron.send('get-api-details');
}

// Close the electron application
function closeApp() {
    if (electron) {
        electron.send('app-close');
    }
}

/* anti pattern because react useState can't keep up */
let scannerData = '';
let readingScanner = false;

let setScannerData = (newScannerData: string) => (scannerData = newScannerData);
let setReadingScanner = (newReadingScanner: boolean) =>
    (readingScanner = newReadingScanner);

export default function App() {
    const dispatch = useAppDispatch();

    const timerRef = useRef<NodeJS.Timeout>();

    useHotkeys('F8', (event) => {
        scanBegin(event);
    });
    useHotkeys('ctrl+j', (event) => {
        setReadingScanner(true);
        scanBegin(event);
    });
    useHotkeys(
        'F9',
        (event) => {
            scanEnd(event);
        },
        [scannerData],
    );
    useHotkeys(
        'ctrl+k',
        (event) => {
            scanEnd(event);
        },
        [scannerData],
    );
    useHotkeys(
        '*',
        (event) => {
            scanData(event);
        },
        [readingScanner, scannerData],
    );

    function scanBegin(event: KeyboardEvent) {
        event.preventDefault();
        setScannerData('');
        setReadingScanner(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(scanCancelled, 10000);
    }

    function scanEnd(event: KeyboardEvent) {
        event.preventDefault();
        if (timerRef.current) clearTimeout(timerRef.current);
        setReadingScanner(false);

        // Pass along the scanned data to the store?
        dispatch(newScan(scannerData));
        console.log(`Scan: ${scannerData}`);

        setScannerData('');
    }

    function scanData(event: KeyboardEvent) {
        if (
            readingScanner &&
            !(event.key === 'F8') &&
            !(event.key === 'F9') &&
            !(event.key === 'Shift') &&
            !(event.key === 'Control') &&
            !event.ctrlKey &&
            !event.altKey
        ) {
            event.preventDefault();
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(scanCancelled, 1000);

            setScannerData(scannerData + event.key);
        }
    }

    function scanCancelled() {
        setScannerData('');
        setReadingScanner(false);
    }

    return (
        <>
            <Router>
                <Container
                    fluid
                    className="d-flex flex-column p-0 vh-100 vw-100 overflow-hidden"
                >
                    <MainMenu
                        closeAction={() => {
                            closeApp();
                        }}
                    />
                    <Container
                        typeof="main"
                        fluid
                        className="flex-fill flex-grow-1 pe-0 overflow-auto"
                    >
                        <Routes />
                    </Container>
                    <Footer />
                </Container>
                <ApplicationNotification />
                <ApplicationError />
            </Router>
        </>
    );
}
