import React from "react"
import Configure from "../../common/configure"
import styles from "./index.less";

class Vericode extends React.Component {
	constructor(props) {
		super(props);

        this.state = {
          src: Configure.getImageCode()
        };		

        //确保在div的onclick中此函数可以使用this指针
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		this.setState({ src: Configure.getImageCode() });
	}

	freshCode() {
		this.setState({ src: Configure.getImageCode() });
	}

	render() {
		const {width, height} = this.props;
	    return (
	    	<div onClick={this.handleClick}>
        		<img className={styles.codeimg} style={{width:width,height:height}} src={this.state.src} alt="点击刷新"/> 
        	</div>   	
	    );
	}	
}

export default Vericode;