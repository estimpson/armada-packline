import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    FloatingLabel,
} from '../bootstrap';
import {
    IIdentity,
    loginAsync,
    selectIdentity,
} from '../features/identity/identitySlice';
import {
    IPackingJob,
    selectPackingJob,
} from '../features/packingJob/packingJobSlice';
import { RunJob } from './run-job/RunJob';

export default function Home() {
    const dispatch = useAppDispatch();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    // dependent data sets
    const packingJob: IPackingJob = useAppSelector(selectPackingJob);

    const identity: IIdentity = useAppSelector(selectIdentity);

    return (
        <>
            <Container className="col-md-8 col-lg-6">
                <Row>
                    <Col sm="8">
                        <p className="fs-1">Fx Pack Line</p>
                    </Col>
                </Row>
                {identity?.userName ? (
                    <>
                        <RunJob packingJob={packingJob} />
                    </>
                ) : (
                    <>
                        <h1>Please login</h1>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <FloatingLabel
                                        controlId="floatingInput-user"
                                        label="User"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            placeholder="user"
                                            onChange={(e) =>
                                                setUser(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel
                                        controlId="floatingInput-password"
                                        label="Password"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            type="password"
                                            placeholder="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
                                    <Form.Group>
                                        <Button
                                            onClick={() =>
                                                dispatch(
                                                    loginAsync({
                                                        user: user,
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
}
