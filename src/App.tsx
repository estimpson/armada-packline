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
    return (
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
                    className="flex-fill flex-grow-1 py-4 overflow-auto"
                >
                    <Routes />
                </Container>
                <Footer />
            </Container>
            <ApplicationError />
        </Router>
    );
}
