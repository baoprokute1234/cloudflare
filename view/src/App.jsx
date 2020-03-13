import React from 'react';
import './App.scoped.scss';
import axios from 'axios';
import { sleep } from '../../common/common.js';
// import async from 'async';

const sleepSeconds = 60;
// const retryTimes = 5;

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
    const [isPaused, setIsPaused] = React.useState(false);
    const [dataGot, setDataGot] = React.useState(0);

    React.useEffect(() => {
        if (isLoop && !isPaused) {
            for (let i = 0; i < 2; i++) {
                axios.post(`/${referrer}`)
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => console.log(err));
                let temp = dataGot;
                setDataGot(temp + 2);
            }
            setIsPaused(true);
            sleep(sleepSeconds * 1000)
                .then(() => setIsPaused(false));
        }
    }, [isPaused, isLoop])

    const submitForm = event => {
        event.preventDefault();
        let ref = event.target.referrer.value;
        setReferrer(ref);
        setIsLoop(true);
    }

    const stopRequest = event => {
        event.preventDefault();
        setIsLoop(false);
        setDataGot(0);
    }

    return (
        <div className="row d-flex align-items-center justify-content-center vh-100">
            <div className="col-lg-6 col-11 row mainbox py-5 px-lg-5 px-3">
                <div className="col-12">
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
                </div>
                {
                    isLoop &&
                    <div className='col-12 d-flex flex-column justify-content-center mt-4 big-font '>
                        <span className='text-center'>Getting Data for you...</span>
                        <span className='text-center mt-2'>{dataGot} GB</span>
                    </div>
                }
            </div>
        </div>
    );
}

export default React.memo(App);