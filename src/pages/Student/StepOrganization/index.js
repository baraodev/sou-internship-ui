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

class StepOrganization extends Component {
	handleCep = async (e, setFieldValue) => {
		const res = await cep.get(`${e.target.value}/json`);
		const { logradouro: street, localidade: city, uf: state } = res.data;

		setFieldValue('organization.street', street);
		setFieldValue('organization.city', city);
		setFieldValue('organization.state', state);
	};

	getValidationSchema = () =>
		Yup.object().shape({
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
			})
		});

	render() {
		const {
			handleSubmit,
			organizationOptions,
			buttons,
			initialValues: { organizationSelected, internship: { type, organization, documents } },
			saveChanges
		} = this.props;

		return (
			<Formik
				onSubmit={handleSubmit}
				validationSchema={this.getValidationSchema}
				initialValues={{
					type,
					organizationSelected,
					organization,
					documents
				}}
			>
				{({ setFieldValue, values, handleBlur }) => (
					<Form>
						<Title>Dados do aproveitamento</Title>
						<Row>
							<Col width="70%">
								<RadioLabel>
									<RadioField
										type="radio"
										name="type"
										onChange={() => setFieldValue('type', 1)}
										value={values.type === 1}
										checked={values.type === 1}
									/>{' '}
									Estágio já realizado em uma graduação
								</RadioLabel>
								<RadioLabel>
									<RadioField
										type="radio"
										name="type"
										onChange={() => setFieldValue('type', 2)}
										value={values.type === 2}
										checked={values.type === 2}
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
												setFieldValue('organization.document_number', option.document_number);
												setFieldValue(
													'organization.organization_name',
													option.organization_name
												);
												setFieldValue('organization.phone1', option.phone1);
												setFieldValue('organization.phone2', option.phone2 || '');
												setFieldValue('organization.fax', option.fax || '');
												setFieldValue('organization.zipcode', option.zipcode);
												setFieldValue('organization.street_number', option.street_number);
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
										name="organization.document_number"
										render={({ field }) => (
											<InputMask
												{...field}
												mask="99.999.999/9999-99"
												maskChar={null}
												onBlur={(e) => {
													field.onBlur(e);
													setFieldValue(
														field.name,
														field.value.match(/\d+/g).length
															? field.value.match(/\d+/g).join('')
															: ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
											/>
										)}
									/>
									<ErrorMessage name="organization.cnpj" component={Error} />
								</Label>
							</Col>
							<Col>
								<Label>
									Nome<span>*</span>
									<Field
										name="organization.organization_name"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
									/>
									<ErrorMessage name="organization.organization_name" component={Error} />
								</Label>
							</Col>
						</Row>
						<Row>
							<Col>
								<Label>
									Telefone 1<span>*</span>
									<Field
										name="organization.phone1"
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
									<ErrorMessage name="organization.phone1" component={Error} />
								</Label>
							</Col>
							<Col>
								<Label>
									Telefone 2
									<Field
										name="organization.phone2"
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
										name="organization.fax"
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
										name="organization.zipcode"
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
														field.value.match(/\d+/g).length
															? field.value.match(/\d+/g).join('')
															: ''
													);
													saveChanges(values);
												}}
												disabled={JSON.stringify(values.organizationSelected) !== '{}'}
												maskChar={null}
											/>
										)}
									/>
									<ErrorMessage name="organization.zipcode" component={Error} />
								</Label>
							</Col>
						</Row>
						<Row>
							<Col width="40%">
								<Label>
									Logradouro<span>*</span>
									<Field
										name="organization.street"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="organization.street" component={Error} />
								</Label>
							</Col>
							<Col width="25%">
								<Label>
									Complemento
									<Field
										name="organization.complement"
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
										name="organization.street_number"
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
									/>
									<ErrorMessage name="organization.street_number" component={Error} />
								</Label>
							</Col>
							<Col width="18%">
								<Label>
									Cidade<span>*</span>
									<Field
										name="organization.city"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="organization.city" component={Error} />
								</Label>
							</Col>
							<Col width="10%">
								<Label>
									UF<span>*</span>
									<Field
										name="organization.state"
										onBlur={(e) => {
											handleBlur(e);
											saveChanges(values);
										}}
										disabled={JSON.stringify(values.organizationSelected) !== '{}'}
										tabIndex="-1"
									/>
									<ErrorMessage name="organization.state" component={Error} />
								</Label>
							</Col>
						</Row>
						{values.type === 1 && (
							<Fragment>
								<Row bottom>
									<Col width="25%">
										<Label>
											Curso<span>*</span>
											<Field
												name="course"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="course" component={Error} />
										</Label>
									</Col>
									<Col width="25%">
										<Label>
											Nome da disciplina de estágio<span>*</span>
											<Field
												name="discipline"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="discipline" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Carga horária da disciplina<span>*</span>
											<Field
												name="workload"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="workload" component={Error} />
										</Label>
									</Col>
									<Col width="30%">
										<Label>
											Semestre/Ano de realização da disciplina<span>*</span>
											<Field
												name="semYear"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="semYear" component={Error} />
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
														'documents.plan',
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
													<Icon src={values.documents.plan ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="documents.plan" component={FileError} />
									</Col>
									<Col>
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ], e) => {
												if (file) {
													setFieldValue(
														'documents.historic',
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
													<Icon src={values.documents.historic ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="documents.historic" component={FileError} />
									</Col>
									<Col>
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ]) => {
												if (file) {
													setFieldValue(
														'documents.diploma',
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
													<Icon src={values.documents.diploma ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="documents.diploma" component={FileError} />
									</Col>
								</Row>
							</Fragment>
						)}
						{values.type === 2 && (
							<Fragment>
								<Row bottom>
									<Col width="20%">
										<Label>
											Data de inicio<span>*</span>
											<Field
												name="course"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="course" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Data de término<span>*</span>
											<Field
												name="semYear"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="semYear" component={Error} />
										</Label>
									</Col>
									<Col width="40%">
										<Label>
											Nome da disciplina de estágio<span>*</span>
											<Field
												name="discipline"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="discipline" component={Error} />
										</Label>
									</Col>
									<Col width="20%">
										<Label>
											Carga horária da disciplina<span>*</span>
											<Field
												name="workload"
												onBlur={(e) => {
													handleBlur(e);
													saveChanges(values);
												}}
											/>
											<ErrorMessage name="workload" component={Error} />
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
														'documents.contract',
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
													<Icon src={values.documents.contract ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="documents.contract" component={FileError} />
									</Col>
									<Col width="33%">
										<Dropzone
											accept="image/jpeg,image/jpg,image/png,image/bmp,application/pdf"
											onDrop={([ file, ...rest ], e) => {
												if (file) {
													setFieldValue(
														'documents.permit',
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
													<Icon src={values.documents.permit ? Success : Upload} />
													<FileField {...getInputProps()} />
													<Button>Procure no computador</Button>
													<Accepted>Arquivos aceitos: pdf, jpg, png, bmp</Accepted>
													<Accepted>Máximo: 1Mb</Accepted>
												</DragDrop>
											)}
										</Dropzone>
										<ErrorMessage name="documents.permit" component={FileError} />
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
