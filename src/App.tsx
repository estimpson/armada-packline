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
import { useRef, useState } from 'react';
import { newScan } from './features/barcodeScanner/barcodeScannerSlice';
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

export default function App() {
    const dispatch = useAppDispatch();

    const [scannerData, setScannerData] = useState('');
    const [readingScanner, setReadingScanner] = useState(false);

    const timerRef = useRef<NodeJS.Timeout>();

    useHotkeys('F8', (event) => {
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
                <ApplicationError />
            </Router>
        </>
    );
}
