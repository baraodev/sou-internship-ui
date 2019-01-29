import React, { Component, Fragment } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import {
	Title,
	Subtitle,
	Row,
	Col,
	Label,
	RadioLabel,
	MyField as Field,
	MyRadioField as RadioField,
	MyMask as InputMask,
	Error,
	DragDrop,
	Text,
	Document,
	Accepted,
	Icon,
	FileField,
	FileError,
	Button
} from './styles';

import cep from '../../../services/viaCep';

import Upload from '../../../assets/imgs/upload.svg';
import Success from '../../../assets/imgs/sucesso_upload.svg';

const colourStyles = {
	control: (styles) => ({ ...styles, backgroundColor: 'white' }),
	option: (styles) => ({
		...styles,
		color: 'black'
	}),
	input: (styles) => ({ ...styles }),
	placeholder: (styles) => ({ ...styles }),
	singleValue: (styles) => ({ ...styles })
};

const SUPPORTED_FORMATS = [ 'image/jpeg', 'image/jpg', 'image/png', 'application/pdf' ];
const FILE_SIZE = 1048576;

class StepOrganization extends Component {
	handleCep = async (e, setFieldValue) => {
		const res = await cep.get(`${e.target.value}/json`);
		const { logradouro: street, localidade: city, uf: state } = res.data;

		setFieldValue('internship.organization.street', street);
		setFieldValue('internship.organization.city', city);
		setFieldValue('internship.organization.state', state);
	};

	getValidationSchema = () =>
		Yup.object().shape({
			internship: Yup.object().shape(
				{
					course: Yup.string().when('type', {
						is: 1,
						then: Yup.required('O campo curso é obrigatório')
					}),
					discipline: Yup.string().when('type', {
						is: 1,
						then: Yup.required('O campo disciplina é obrigatório')
					}),
					workload: Yup.string().required('O campo carga horária é obrigatório'),
					semYear: Yup.string().when('type', {
						is: 1,
						then: Yup.required('O campo semestre/ano é obrigatório')
					}),
					startDate: Yup.string().when('type', {
						is: 2,
						then: Yup.required('O campo data de início é obrigatório')
					}),
					endDate: Yup.string().when('type', {
						is: 2,
						then: Yup.required('O campo data de termíno é obrigatório')
					}),
					organization: Yup.object().shape({
						document_number: Yup.string().required('O campo de documento é obrigatório'),
						organization_name: Yup.string()
							.min(4, 'Nome da instituição muito pequeno')
							.max(80, 'Nome da instituição muito grande')
							.required('O campo Nome é obrigatório'),
						phone1: Yup.string().required('Preencha o campo de telefone 1'),
						zipcode: Yup.string().required('O campo de CEP é obrigatório'),
						street: Yup.string()
							.min(8, 'Nome de logradouro muito pequeno')
							.max(60, 'Nome de logradouro muito grande')
							.required('O campo de logradouro é obrigatório'),
						street_number: Yup.string().required('O campo de número é obrigatório'),
						city: Yup.string()
							.min(4, 'Nome de cidade muito pequeno')
							.max(40, 'Nome de cidade muito grande')
							.required('O campo de cidade é obrigatório'),
						state: Yup.string()
							.min(2, 'Digite a sigla do UF')
							.max(2, 'Digite a sigla do UF')
							.required('O campo de UF é obrigatório')
					}),
					documents: Yup.object().when('type', {
						is: 1,
						then: Yup.object().shape(
							{
								contract: Yup.mixed()
									.test(
										'fileSize',
										'Tamanho do arquivo não suportado, máximo 1Mb',
										(value) => value && value.size <= FILE_SIZE
									)
									.test(
										'fileFormat',
										'Formato não suportado',
										(value) => value && SUPPORTED_FORMATS.includes(value.type)
									)
									.when('permit', (permit, schema) => {
										return permit !== null
											? schema
											: schema.required(
													'É necessário fazer upload do contrato de trabalho ou carteira de trabalho.'
												);
									}),
								permit: Yup.mixed()
									.test(
										'fileSize',
										'Tamanho do arquivo não suportado, máximo 1Mb',
										(value) => value && value.size <= FILE_SIZE
									)
									.test(
										'fileFormat',
										'Formato não suportado',
										(value) => value && SUPPORTED_FORMATS.includes(value.type)
									)
									.when('contract', (contract, schema) => {
										return contract !== null
											? schema
											: schema.required(
													'É necessário fazer upload do contrato de trabalho ou carteira de trabalho.'
												);
									})
							},
							[ 'permit', 'contract' ]
						),
						otherwise: Yup.object().shape(
							{
								contract: Yup.mixed()
									.test(
										'fileSize',
										'Tamanho do arquivo não suportado, máximo 1Mb',
										(value) => value && value.size <= FILE_SIZE
									)
									.test(
										'fileFormat',
										'Formato não suportado',
										(value) => value && SUPPORTED_FORMATS.includes(value.type)
									)
									.when('permit', (permit, schema) => {
										return permit !== null
											? schema
											: schema.isRequired(
													'É necessário fazer upload do contrato de trabalho ou carteira de trabalho.'
												);
									}),
								permit: Yup.mixed()
									.test(
										'fileSize',
										'Tamanho do arquivo não suportado, máximo 1Mb',
										(value) => value && value.size <= FILE_SIZE
									)
									.test(
										'fileFormat',
										'Formato não suportado',
										(value) => value && SUPPORTED_FORMATS.includes(value.type)
									)
									.when('contract', (contract, schema) => {
										return contract !== null
											? schema
											: schema.isRequired(
													'É necessário fazer upload do contrato de trabalho ou carteira de trabalho.'
												);
									})
							},
							[ 'permit', 'contract' ]
						)
					})
				},
				'type'
			)
		});

	render() {
		const {
			handleSubmit,
			organizationOptions,
			buttons,
			initialValues: { organizationSelected, internship },
			saveChanges
		} = this.props;

		return (
			<Formik
				onSubmit={handleSubmit}
				validationSchema={this.getValidationSchema}
				initialValues={{
					organizationSelected,
					internship
				}}
			>
				{({ setFieldValue, values, handleBlur }) => (
					<Form>
						{console.log(values)}
						<Title>Dados do aproveitamento</Title>
						<Row>
							<Col width="70%">
								<RadioLabel>
									<RadioField
										type="radio"
										name="type"
										onChange={() => setFieldValue('internship.type', 1)}
										value={values.internship.type === 1}
										checked={values.internship.type === 1}
									/>{' '}
									Estágio já realizado em uma graduação
								</RadioLabel>
								<RadioLabel>
									<RadioField
										type="radio"
										name="type"
										onChange={() => setFieldValue('internship.type', 2)}
										value={values.internship.type === 2}
										checked={values.internship.type === 2}
									/>{' '}
									Atuação profissional
								</RadioLabel>
							</Col>
						</Row>
						<Subtitle>Busque a instituição ou cadastre uma nova</Subtitle>
						<Row bottom>
							<Col>
								<Field
									name="organizationSelected"
									component={({ field, form }) => (
										<Select
											options={organizationOptions}
											getOptionLabel={(option) => option.organization_name}
											getOptionValue={(option) => option.id}
											name={field.name}
											placeholder="Busque por uma instituição..."
											value={field.value}
											onChange={(option) => {
												setFieldValue(field.name, option);
												setFieldValue(
													'internship.organization.document_number',
													option.document_number
												);
												setFieldValue(
													'internship.organization.organization_name',
													option.organization_name
												);
												setFieldValue('internship.organization.phone1', option.phone1);
												setFieldValue('internship.organization.phone2', option.phone2 || '');
												setFieldValue('internship.organization.fax', option.fax || '');
												setFieldValue('internship.organization.zipcode', option.zipcode);
												setFieldValue(
													'internship.organization.street_number',
													option.street_number
												);
												const e = { target: { value: option.zipcode } };
												this.handleCep(e, setFieldValue);
												saveChanges(values);
											}}
											styles={colourStyles}
											theme={(theme) => ({
												...theme,
												borderRadius: 0,
												colors: {
													...theme.colors,
													primary50: '#C4D1D6',
													primary25: '#EBF1F2',
													primary: '#EBF1F2',
													neutral20: 'rgb(196, 209, 214)'
												}
											})}
										/>
									)}
								/>
							</Col>
						</Row>
						<Row>
							<Col width="22%">
								<Label>
									CNPJ<span>*</span>
									<Field
										name="internship.organization.document_number"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="99.999.999/9999-99"
												maskChar={null}
												onBlur={(e) => {
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.length > 0 ? field.value.match(/\d+/g).join('') : ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
											/>
										)}
									/>
									<ErrorMessage name="internship.organization.document_number" component={Error} />
								</Label>
							</Col>
							<Col>
								<Label>
									Nome<span>*</span>
									<Field
										name="internship.organization.organization_name"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
									/>
									<ErrorMessage name="internship.organization.organization_name" component={Error} />
								</Label>
							</Col>
						</Row>
						<Row>
							<Col>
								<Label>
									Telefone 1<span>*</span>
									<Field
										name="internship.organization.phone1"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="(99) 9999-9999?"
												formatChars={{ '9': '[0-9]', '?': '[0-9 ]' }}
												maskChar={null}
												onBlur={(e) => {
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.length > 1 ? field.value.match(/\d+/g).join('') : ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
											/>
										)}
									/>
									<ErrorMessage name="internship.organization.phone1" component={Error} />
								</Label>
							</Col>
							<Col>
								<Label>
									Telefone 2
									<Field
										name="internship.organization.phone2"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="(99) 9999-9999?"
												formatChars={{ '9': '[0-9]', '?': '[0-9 ]' }}
												maskChar={null}
												onBlur={(e) => {
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.length > 1 ? field.value.match(/\d+/g).join('') : ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
											/>
										)}
									/>
								</Label>
							</Col>
							<Col>
								<Label>
									FAX
									<Field
										name="internship.organization.fax"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="(99) 9999-9999"
												formatChars={{ '9': '[0-9]' }}
												maskChar={null}
												onBlur={(e) => {
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.length > 1 ? field.value.match(/\d+/g).join('') : ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
											/>
										)}
									/>
								</Label>
							</Col>
						</Row>
						<Row>
							<Col width="15%">
								<Label>
									CEP<span>*</span>
									<Field
										name="internship.organization.zipcode"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="99999-999"
												onBlur={(e) => {
													e.preventDefault();
													this.handleCep(e, setFieldValue);
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.length > 0 ? field.value.match(/\d+/g).join('') : ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
												maskChar={null}
											/>
										)}
									/>
									<ErrorMessage name="internship.organization.zipcode" component={Error} />
								</Label>
							</Col>
						</Row>
						<Row>
							<Col width="40%">
								<Label>
									Logradouro<span>*</span>
									<Field
										name="internship.organization.street"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="internship.organization.street" component={Error} />
								</Label>
							</Col>
							<Col width="25%">
								<Label>
									Complemento
									<Field
										name="internship.organization.complement"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
									/>
								</Label>
							</Col>
							<Col width="10%">
								<Label>
									Número<span>*</span>
									<Field
										name="internship.organization.street_number"
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
									/>
									<ErrorMessage name="internship.organization.street_number" component={Error} />
								</Label>
							</Col>
							<Col width="18%">
								<Label>
									Cidade<span>*</span>
									<Field
										name="internship.organization.city"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="internship.organization.city" component={Error} />
								</Label>
							</Col>
							<Col width="10%">
								<Label>
									UF<span>*</span>
									<Field
										name="internship.organization.state"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="internship.organization.state" component={Error} />
								</Label>
							</Col>
						</Row>
						{values.internship.type === 1 && (
							<Fragment>
								<Row bottom>
									<Col width="25%">
										<Label>
											Curso<span>*</span>
											<Field
												name="internship.course"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.course" component={Error} />
										</Label>
									</Col>
									<Col width="25%">
										<Label>
											Nome da disciplina de estágio<span>*</span>
											<Field
												name="internship.discipline"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.discipline" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Carga horária da disciplina<span>*</span>
											<Field
												name="internship.workload"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.workload" component={Error} />
										</Label>
									</Col>
									<Col width="30%">
										<Label>
											Semestre/Ano de realização da disciplina<span>*</span>
											<Field
												name="internship.semYear"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.semYear" component={Error} />
										</Label>
									</Col>
								</Row>
								<Row>
									<Col>
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ]) => {
												if (file) {
													setFieldValue(
														'internship.documents.plan',
														Object.assign(file, {
															preview: URL.createObjectURL(file)
														})
													);
												}
											}}
											multiple={false}
										>
											{({ getRootProps, getInputProps, error }) => (
												<DragDrop {...getRootProps()}>
													<Document>Plano de Ensino</Document>
													<Text>Arraste para cá ou</Text>
													<Icon src={values.internship.documents.plan ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="internship.documents.plan" component={FileError} />
									</Col>
									<Col>
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ], e) => {
												if (file) {
													setFieldValue(
														'internship.documents.historic',
														Object.assign(file, {
															preview: URL.createObjectURL(file)
														})
													);
												}
											}}
											multiple={false}
										>
											{({ getRootProps, getInputProps }) => (
												<DragDrop {...getRootProps()}>
													<Document>Histórico Escolar</Document>
													<Text>Arraste para cá ou</Text>
													<Icon
														src={values.internship.documents.historic ? Success : Upload}
													/>
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="internship.documents.historic" component={FileError} />
									</Col>
									<Col>
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ]) => {
												if (file) {
													setFieldValue(
														'internship.documents.diploma',
														Object.assign(file, {
															preview: URL.createObjectURL(file)
														})
													);
												}
											}}
											multiple={false}
										>
											{({ getRootProps, getInputProps }) => (
												<DragDrop {...getRootProps()}>
													<Document>Diploma</Document>
													<Text>Arraste para cá ou</Text>
													<Icon
														src={values.internship.documents.diploma ? Success : Upload}
													/>
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="internship.documents.diploma" component={FileError} />
									</Col>
								</Row>
							</Fragment>
						)}
						{values.internship.type === 2 && (
							<Fragment>
								<Row bottom>
									<Col width="20%">
										<Label>
											Data de inicio<span>*</span>
											<Field
												name="internship.startDate"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.startDate" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Data de término<span>*</span>
											<Field
												name="internship.endDate"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.endDate" component={Error} />
										</Label>
									</Col>
									<Col width="40%">
										<Label>
											Nome da disciplina de estágio<span>*</span>
											<Field
												name="internship.discipline"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.discipline" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Carga horária da disciplina<span>*</span>
											<Field
												name="internship.workload"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="internship.workload" component={Error} />
										</Label>
									</Col>
								</Row>
								<Row>
									<Col width="33%">
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ]) => {
												if (file) {
													setFieldValue(
														'internship.documents.contract',
														Object.assign(file, {
															preview: URL.createObjectURL(file)
														})
													);
												}
											}}
											multiple={false}
										>
											{({ getRootProps, getInputProps, error }) => (
												<DragDrop {...getRootProps()}>
													<Document>Contrato de trabalho</Document>
													<Text>Arraste para cá ou</Text>
													<Icon
														src={values.internship.documents.contract ? Success : Upload}
													/>
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="internship.documents.contract" component={FileError} />
									</Col>
									<Col width="33%">
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ], e) => {
												if (file) {
													setFieldValue(
														'internship.documents.permit',
														Object.assign(file, {
															preview: URL.createObjectURL(file)
														})
													);
												}
											}}
											multiple={false}
										>
											{({ getRootProps, getInputProps }) => (
												<DragDrop {...getRootProps()}>
													<Document>Carteira de trabalho</Document>
													<Text>Arraste para cá ou</Text>
													<Icon src={values.internship.documents.permit ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="internship.documents.permit" component={FileError} />
									</Col>
								</Row>
							</Fragment>
						)}
						{buttons}
					</Form>
				)}
			</Formik>
		);
	}
}

export default StepOrganization;
