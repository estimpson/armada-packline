import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Button, Card, Col, Container, Form, Row } from '../bootstrap';
import { DemoParts } from '../data/demo/DemoParts';
import { IPart } from '../data/Part';
import {
    IIdentity,
    loginAsync,
    selectIdentity,
} from '../features/identity/identitySlice';
import { RunJob } from './RunJob';

export default function Home() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    // dependent data sets
    const [partList, setPartList] = useState<IPart[]>([]);

    // job state
    const [partCode, setPartCode] = useState<string | undefined>(undefined);
    const [part, setPart] = useState<IPart | undefined>(undefined);
    const [acknowledgedSpecialInstructions, setAacknowlgedSpecialInstructions] =
        useState(false);

    useEffect(() => {
        setPartList(DemoParts);
    }, [partList]);

    useEffect(() => {
        setAacknowlgedSpecialInstructions(false);
        if (partCode) {
            let part = partList.find((part) => {
                return part.partCode === partCode;
            });
            if (part) {
                setPart(part);
                return;
            }
        }
        setPart(undefined);
    }, [partCode, partList]);

    const identity: IIdentity = useAppSelector(selectIdentity);
    const dispatch = useAppDispatch();

    return (
        <>
            <Container>
                <Row>
                    <Col sm="8">
                        <p className="fs-1">Fx Pack Line</p>
                    </Col>
                </Row>
                {identity?.userName ? (
                    <>
                        <RunJob
                            partList={partList}
                            part={partCode}
                            partSetter={setPartCode}
                            instructions={part?.specialInstructions}
                            acknowledged={acknowledgedSpecialInstructions}
                            acknowledgeHandler={
                                setAacknowlgedSpecialInstructions
                            }
                            standardPack={part?.standardPack}
                        />
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
                                        controlId="formUser"
                                    >
                                        <Form.Label column sm="6" md="4" lg="2">
                                            User:
                                        </Form.Label>
                                        <Col sm="12" md="8" lg="4">
                                            <Form.Control
                                                onChange={(e) =>
                                                    setUser(e.target.value)
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
