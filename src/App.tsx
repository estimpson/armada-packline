import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './routes';
import { MainMenu } from './components/layout/Menu';
import './App.css';
import { Footer } from './components/layout/Footer';
import { Container } from 'react-bootstrap';

export default function App() {
    return (
        <Router>
            <MainMenu />
            <Container typeof="main" className="flex-shrink-0 mt-5">
                <Routes />
            </Container>
            <Footer />
        </Router>
    );
}
