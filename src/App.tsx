import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './routes';
import Container from 'react-bootstrap/container';
import { MainMenu } from './components/layout/Menu';
import { Footer } from './components/layout/Footer';
import { ApplicationError } from './components/layout/ApplicationError';
import './App.css';

export default function App() {
    return (
        <Router>
            <MainMenu />
            <Container typeof="main" className="flex-shrink-0 mt-5">
                <Routes />
            </Container>
            <Footer />
            <ApplicationError />
        </Router>
    );
}
