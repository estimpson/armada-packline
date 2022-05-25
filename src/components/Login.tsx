import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { Button, Card, Form, FloatingLabel } from '../bootstrap';
import { loginAsync } from '../features/identity/identitySlice';

export default function Login() {
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState('');

    return (
        <>
            <h1>Please login</h1>
            <Card>
                <Card.Body>
                    <Form>
                        <FloatingLabel
                            controlId="floatingInput-password"
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control
                                type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        dispatch(
                                            loginAsync({
                                                password: password,
                                            }),
                                        );
                                    }
                                }}
                            />
                        </FloatingLabel>
                        <Form.Group>
                            <Button
                                onClick={() =>
                                    dispatch(
                                        loginAsync({
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
    );
}
