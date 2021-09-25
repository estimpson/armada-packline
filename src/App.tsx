import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from './bootstrap';
import { ApplicationError } from './components/layout/ApplicationError';
import { Footer } from './components/layout/Footer';
import { MainMenu } from './components/layout/Menu';
import { Routes } from './routes';
export { default as logo } from './icon.png';

export default function App() {
    return (
        <Router>
            <Container
                fluid
                className="d-flex flex-column p-0 vh-100 vw-100 overflow-hidden"
            >
                <MainMenu closeAction={() => {}} />
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
