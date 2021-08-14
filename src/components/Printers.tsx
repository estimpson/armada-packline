import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Row,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

interface IPrinter {
    printerName: string;
    printerDriver: string;
}

export default function PrinterList() {
    // State
    const [error, setError] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [printers, setPrinters] = useState<IPrinter[]>([]);

    useEffect(() => {
        axios
            .get<IPrinter[]>('/api/printerlist')
            .then((response) => {
                setPrinters(response.data);
                setIsLoaded(true);
            })
            .catch((ex) => {
                let error =
                    ex.code === 'ECONNABORTED'
                        ? 'A timeout has occurred'
                        : ex.response.status === 404
                        ? 'Resource Not Found'
                        : 'An unexpected error has occurred';

                setError(error);
                setIsLoaded(false);
            });
    }, []);

    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Available Printers</Card.Title>
                            {error ? (
                                <span>'Error: ' {error}</span>
                            ) : isLoaded ? (
                                <ListGroup>
                                    {printers.map((printer) => {
                                        return (
                                            <ListGroupItem
                                                key={printer.printerName}
                                            >
                                                <Row>
                                                    <Col xs={6}>
                                                        {printer.printerName}
                                                    </Col>
                                                    <Col xs={6}>
                                                        {printer.printerDriver}
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        );
                                    })}
                                </ListGroup>
                            ) : (
                                <Card.Text>Loading...</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Link to="/">Return to home</Link>
                </Col>
            </Row>
        </Container>
    );
}
