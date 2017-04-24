'use strict';

require('./index.less');

const React = require('react');
const Component = React.Component;
const PropTypes = React.PropTypes;

/**
 * react-demo
 */
class ReactDemo extends Component {
    static contextTypes = {
        legoWidgetId: PropTypes.string
    };
    static propTypes = {
        title: PropTypes.string.isRequired,
        desc: PropTypes.string,
        currentTime: PropTypes.string
    };
    static defaultProps = {
        desc: '',
        currentTime: ''
    };

    render() {
        const title = this.props.title;
        if (!title) return false;

        const desc = this.props.desc;
        const currentTime = this.props.currentTime;

        return (
            <div className="lego-test-section">
                <div className="title">{title}</div>
                <div className="desc">{desc}</div>
                <div className="now">当前时间：{currentTime}</div>
            </div>
        );
    }
}

module.exports = ReactDemo;
