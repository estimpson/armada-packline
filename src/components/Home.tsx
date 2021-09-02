import {
    faPencilAlt,
    faSdCard,
    faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
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

    const require = window.require ? window.require : null;
    const ipcRenderer = require ? require('electron')?.ipcRenderer : null;
    if (ipcRenderer) {
        ipcRenderer.on('got_app_version', (sender: any, data: string) => {
            console.log(`sender: ${sender}`);
            console.log(`version: ${data}`);
        });
        ipcRenderer.send('app_version');
        ipcRenderer.on('got_app_updates', (sender: any, data: string) => {
            console.log(`sender: ${sender}`);
            console.log(`updates: ${data}`);
        });
        ipcRenderer.send('app_updates');
    }

    return (
        <>
            <Container>
                {identity?.userName ? (
                    <>
                        <Container className="d-flex justify-content-center px-0 mb-5">
                            <p className="display-6">
                                Welcome, {identity.userName}
                            </p>
                            <Button
                                className="mx-5 my-auto"
                                onClick={() => dispatch(logout())}
                            >
                                Logout
                            </Button>
                        </Container>
                        <p className="bd-lead">
                            The Aztec Supplier Portal is here to assist you in
                            meeting Aztec's labelling requirements.
                        </p>
                        <p className="text-justify">
                            When you ship product to any of Aztec's locations,
                            please be sure to label that product in accordance
                            with Aztec's labelling requirements. This portal can
                            be used to print labels on virtually any thermal
                            label printer, such as Zebra, Sato, or Intermec.
                        </p>
                        <p className="text-justify">
                            To get started using this portal, visit the{' '}
                            <span className="text-light bg-dark px-1">
                                Printers
                            </span>{' '}
                            screen and select the locally attached printer that
                            you want to use when printing Aztec's labels. You'll
                            need to do this once on every PC you use to print
                            labels using this portal. You don't have to change
                            your Window's default printer, and in fact you
                            probably don't want to unless you always print to
                            the thermal label printer from this computer. While
                            you're there, you can print a test page to make sure
                            your printer is working properly.
                        </p>
                        <p className="text-justify">
                            Once you're able to print successfully, you can
                            generate new labels from the{' '}
                            <span className="text-light bg-dark px-1">
                                Generate Inventory
                            </span>{' '}
                            screen. Fill in the form at the top with all of the
                            required information, and click the button to create
                            a batch of inventory. If you need to edit the
                            quantity or lot number of the individual serials in
                            the batch, you can use the{' '}
                            <FontAwesomeIcon icon={faPencilAlt} /> icon to edit
                            the batch one serial at a time. Use the{' '}
                            <FontAwesomeIcon icon={faSdCard} /> icon to save
                            your edits or the{' '}
                            <FontAwesomeIcon icon={faUndoAlt} /> icon to cancel
                            your changes. When your ready to print labels, use
                            the top checkbox to select all of the serials in the
                            batch or the individual checkboxes on each serial to
                            print just a subset.
                        </p>
                        <p className="text-justify">
                            If you need to reprint any labels from a previous
                            batch, the{' '}
                            <span className="text-light bg-dark px-1">
                                Reprint Labels
                            </span>{' '}
                            screen is here to help. Simply select the lot number
                            corresponding to a previously created batch to edit
                            (optionally) and reprint any or all labels in that
                            batch.
                        </p>
                        {ipcRenderer ? (
                            <Button onClick={() => ipcRenderer.send('close')}>
                                Close
                            </Button>
                        ) : (
                            <></>
                        )}
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
}
