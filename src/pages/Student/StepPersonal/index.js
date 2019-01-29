import React from 'react';
import { Formik, Form } from 'formik';

import { Title, Row, Col, Datum } from './styles';

const StepPersonal = ({ handleSubmit, buttons, values }) => (
	<Formik onSubmit={handleSubmit}>
		<Form>
			<Title>Dados Pessoais</Title>
			<Row>
				<Col>
					<Datum>
						Nome Civil
						<span>
							{values.personal.student.name} {values.personal.student.last_name}
						</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Nome Social
						<span>{values.personal.student.assumed_name || 'Não possui'}</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Documento de Identidade
						<span>
							{values.personal.identity[0].number.replace(
								/^(\d{2})(\d{3})(\d{3})(\d{1}).*/,
								'$1.$2.$3-$4'
							)}
						</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Emissor/Estado
						<span>{values.personal.identityEmissor[0].name}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Nacionalidade
						<span>{values.personal.country[0].portuguese_name}</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						CPF
						<span>
							{values.personal.student.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')}
						</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Titulo de Eleitor
						<span>
							{/* values.personal.documents.electoralCard.replace(
								/^(\d{4})(\d{4})(\d{4})(\d{2}).,
								'$1 $2 $3 $4'
              ) || 'Não Possui' */}
							1234 1234 1234 1234
						</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Certificado de Reservista
						<span>
							{/* {values.personal.documents.certificateReservist || 'Não Possui'} */}
							12321312321321
						</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Naturalidade
						<span>{values.personal.city[0].name}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Data de Nascimento
						<span>
							{values.personal.student.birth_date.replace(/^(\d{4})-(\d{2})-(\d{2}).*/, '$3/$2/$1')}
						</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Nome da Mãe
						<span>{values.personal.mother[0].name}</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Nome do Pai
						<span>{values.personal.father[0].name}</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						Endereço Residencial (com complementos)
						<span>
							{`${values.personal.address[0].street}, ${values.personal.address[0].street_number} ${values
								.personal.address[0].complement || ''}`}
						</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						CEP
						<span>{values.personal.address[0].zipcode.replace(/^(\d{5})(\d{3}).*/, '$1-$2')}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Bairro
						<span>{values.personal.address[0].neighborhood}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Cidade
						<span>{values.personal.city[0].name}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Estado
						<span>{values.personal.address[0].state}</span>
					</Datum>
				</Col>
			</Row>
			<Row>
				<Col>
					<Datum>
						E-mail Pessoal
						<span>{values.personal.email[0].email}</span>
					</Datum>
				</Col>
				<Col>
					<Datum>
						Telefone
						<span>
							({values.personal.telephone[0].ddd}) {values.personal.telephone[0].telephones}
						</span>
					</Datum>
				</Col>
			</Row>
			{buttons}
		</Form>
	</Formik>
);

export default StepPersonal;
