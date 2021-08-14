import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    IIdentity,
    loginAsync,
    logout,
    selectIdentity,
} from '../features/identity/identitySlice';

export default function Home() {
    const [fxSPID, setFxSPID] = useState('');
    const [password, setPassword] = useState('');

    const identity: IIdentity = useAppSelector(selectIdentity);
    const dispatch = useAppDispatch();

    // useEffect(() => {
    //     dispatch(loginAsync({ fxSPID: 'ROC0010', password: 'ROC0010' }));
    // }, []);

    return (
        <>
            <Container>
                {identity?.userName ? (
                    <>
                        <h1>Welcome {identity.userName}</h1>
                        <Button onClick={() => dispatch(logout())}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <h1>Please login</h1>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                        controlId="formFxSPID"
                                    >
                                        <Form.Label column sm="6" md="4" lg="2">
                                            User:
                                        </Form.Label>
                                        <Col sm="12" md="8" lg="4">
                                            <Form.Control
                                                onChange={(e) =>
                                                    setFxSPID(e.target.value)
                                                }
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group
                                        as={Row}
                                        className="mb-3"
                                        controlId="formPassword"
                                    >
                                        <Form.Label column sm="6" md="4" lg="2">
                                            Password:
                                        </Form.Label>
                                        <Col sm="12" md="8" lg="4">
                                            <Form.Control
                                                type="password"
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group>
                                        <Button
                                            onClick={() =>
                                                dispatch(
                                                    loginAsync({
                                                        fxSPID: fxSPID,
                                                        password: password,
                                                    }),
                                                )
                                            }
                                        >
                                            Submit
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </>
    );
    // {
    //   (identity) ?
    //   <h1 className="header">Welcome {identity.userName}</h1>
    //   : <h1 className="header">Please login</h1>
    // });
}
