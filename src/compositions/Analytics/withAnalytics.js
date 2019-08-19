import { compose, lifecycle } from 'recompose';
import ReactGA from 'react-ga';

const trackPageview = compose(lifecycle({
    componentDidMount() {
        if (process.env.REACT_APP_ENV === 'production') {
            ReactGA.pageview(window.location.pathname)
        }
    }
}))

export default trackPageview;
