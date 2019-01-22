import styled, { css } from 'styled-components';
import InputMask from 'react-input-mask';
import { Field } from 'formik';

const Title = styled.h2`
	display: block;
	font-size: 1.7rem;
	margin: 5vh 0 1rem;
`;

const Subtitle = styled.h3`
	display: block;
	font-size: 1.2rem;
	text-transform: uppercase;
	margin-top: 6vh;
`;

const Row = styled.div`
	width: 100%;
	display: flex;
	${({ bottom }) => bottom && css`margin-bottom: 6vh;`};
`;

const Col = styled.div`
	width: ${({ width }) => width || '100%'};
	height: 100%;
	padding: 8px;
`;

const Label = styled.label`
	position: relative;
	vertical-align: center;
	font-size: 1rem;
	color: var(--black-lighten);
	span {
		color: var(--red);
	}
`;

const RadioLabel = styled.label`
	position: relative;
	display: inline-flex;
	vertical-align: center;
	font-size: 1rem;
	color: var(--black-lighten);
	margin-right: 30px;
	margin-top: 5vh;
	span {
		color: var(--red);
	}
`;

const MyField = styled(Field)`
  width: 100%;
  height: 25px;
  border: 1px solid var(--gray);
  padding: 5px;
  margin-top: 5px;
`;

const MyRadioField = styled(Field)`
  width: 16px;
  height: 16px;
  margin-right: 10px;
`;

const MyMask = styled(InputMask)`
  width: 100%;
  height: 25px;
  border: 1px solid var(--gray);
  padding: 5px;
  margin-top: 5px;
`;

const HorizontalDivider = styled.hr`
	width: 90%;
	margin: 5vh 0;
	height: 1px;
	color: rgba(0, 0, 0, 0.3);
	background-color: rgba(0, 0, 0, 0.3);
	border: none;
`;

const Radio = styled.input`display: none;`;

const Check = styled.span`
	display: inline-block;
	width: 14px;
	height: 14px;
	border-radius: 50%;
	margin: 15px 5px 0 0;
	cursor: pointer;
	${(props) =>
		props.checked
			? css`
					background-image: radial-gradient(var(--red) 50%, var(--gray) 50%);
				`
			: css`
					background-color: var(--gray);
				`};
`;

const Link = styled.a`
	color: var(--purple);
	text-decoration: none;
`;

const Error = styled.span`
	display: block;
	color: var(--red);
`;

const DragDrop = styled.div`
	display: block;
	width: 100%;
	height: 100%;
	padding: 10px;
	text-align: center;
	border: 1px dashed var(--gray);
`;

const Document = styled.h3`
	display: inline-block;
	width: 100%;
	height: 30px;
	line-height: 30px;
	color: var(--zero);
	letter-spacing: 0.05rem;
	font-size: 1.1rem;
	background-color: var(--gray-darken);
	text-transform: uppercase;
	margin: 0;
`;

const Text = styled.p`font-weight: 500;`;

const Accepted = styled.span`
	display: block;
	font-size: 0.8rem;
	color: var(--gray);
`;

const Icon = styled.img`
	display: block;
	width: 80px;
	height: 80px;
	margin: 1rem auto;
`;

const FileError = styled.span`
	display: inline-block;
	width: 100%;
	color: var(--zero);
	background-color: var(--red);
	padding: 10px;
`;

const FileField = styled.input`display: none;`;

const Button = styled.a`
	display: block;
	width: 70%;
	height: 30px;
	line-height: 30px;
	margin: 0 auto 0.5rem;
	background-color: var(--zero);
	border: 1px solid var(--black-lighten);
	cursor: pointer;
`;

export {
	Title,
	Subtitle,
	Row,
	Col,
	Label,
	RadioLabel,
	MyField,
	MyRadioField,
	MyMask,
	HorizontalDivider,
	Radio,
	Check,
	Link,
	Error,
	DragDrop,
	Document,
	Text,
	Accepted,
	Icon,
	FileError,
	FileField,
	Button
};
