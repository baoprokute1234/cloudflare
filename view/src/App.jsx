import React from 'react';
import './App.scoped.scss';
import axios from 'axios';
import { sleep } from '../../common/common.js';

const sleepTime = 60;
const retryTimes = 5;

const App = () => {
    const usePersistedState = (key, defaultValue) => {
        const [state, setState] = React.useState(
            () => JSON.parse(localStorage.getItem(key)) || defaultValue
        );
        React.useEffect(() => {
            localStorage.setItem(key, JSON.stringify(state));
        }, [key, state]);
        return [state, setState];
    }

    const [referrer, setReferrer] = usePersistedState('referrer', '');
    const [isLoop, setIsLoop] = React.useState(false);

    React.useEffect(() => {
        const sendRequest = ref => {
            return new Promise(resolve => {
                axios.post(`/${ref}`)
                    .then(res => {
                        // console.log(res.data);
                        if (res.data.status === 200) {
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                    })
                    .catch(err => console.log(err))
            })
        }

        const loop = async () => {
            while (isLoop) {
                if (await sendRequest(referrer)) {
                    console.log(`Got 1GB Data`);
                } else {
                    for (let r = 0; r < retryTimes; r++) {
                        await sleep(sleepTime * 1000);
                        if (await sendRequest(referrer)) {
                            console.log(`Got 1GB Data after ${r + 1} retry`);
                            break;
                        } else {
                            console.log(`Error, will sleep for ${sleepTime}s`);
                            if (r === retryTimes - 1) {
                                return;
                            }
                        }
                    }
                }
            }
        }
        loop();
    })

    const submitForm = event => {
        event.preventDefault();
        let ref = event.target.referrer.value;
        setReferrer(ref);
        setIsLoop(true);
    }

    const stopRequest = event => {
        event.preventDefault();
        setIsLoop(false);
    }

    return (
        <div className="App row d-flex align-items-center justify-content-center vh-100">
            <div className="col-lg-6 col-11 mainbox py-5 px-lg-5 px-3">
                <form onSubmit={event => submitForm(event)}>
                    <div className="input-group mb-4">
                        <input type="text" name="referrer" className="form-control" placeholder="Your ID" defaultValue={referrer} />
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        {isLoop ?
                            <button className="btn btn-lg btn-success" onClick={event => stopRequest(event)}>STOP!</button> :
                            <button type="submit" className="btn btn-primary btn-lg">BOOST!</button>
                        }
                    </div>
                </form>
                {
                    isLoop && <div className='d-flex justify-content-center mt-4 big-font'>Getting Data for you...</div>
                }
            </div>
        </div>
    );
}

export default React.memo(App);