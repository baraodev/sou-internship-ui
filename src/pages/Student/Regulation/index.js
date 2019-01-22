import React from 'react';

import { Container, Frame, Agreement } from './styles';

const Regulation = () => (
	<Container>
		<Frame
			src={`https://docs.google.com/viewer?srcid=1U1mHTqKTm7YZ_LQpHzZx5MvuodiVkjyR&pid=explorer&efh=false&a=v&chrome=false&embedded=true`}
			frameBorder="0"
			height="550px"
			width="70%"
		/>
		<Agreement to="explotation">Eu concordo</Agreement>
	</Container>
);

export default Regulation;
