import React, { Component } from 'react';
import Alert from 'react-s-alert';
import LoadingScreen from 'react-loading-screen';

import Stepper from '../../../components/Stepper';
import StepPersonal from '../StepPersonal';
import StepOrganization from '../StepOrganization';
import StepSummary from '../../StepSummary';

import api from '../../../services/api';

import { Container, Title, Subtitle, GroupButton, Button } from './styles';
import PersonalData from '../../../assets/imgs/dadospessoais.svg';
import CourseData from '../../../assets/imgs/concedente.svg';
import Summary from '../../../assets/imgs/resumo.svg';

const stepper = [
	{
		name: 'Dados pessoais',
		icon: PersonalData
	},
	{
		name: 'Aproveitamento',
		icon: CourseData
	},
	{
		name: 'Resumo',
		icon: Summary
	}
];

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

class StudentForm extends Component {
	state = {
		loading: false,
		step: 0,
		values: {
			organizationSelected: {},
			personal: {
				course: [
					{
						id: null,
						name: null,
						duration_semesters: null,
						course_type: null,
						created_at: null,
						updated_at: null,
						deleted_at: null
					}
				],
				student: {
					id: null,
					course_class_id: null,
					countriy_id: null,
					address_id: null,
					city_id: null,
					name: null,
					last_name: null,
					cpf: '',
					birth_date: '',
					assumed_name: null
				},
				address: [
					{
						id: null,
						city_id: null,
						neighborhood: null,
						street: null,
						street_number: null,
						street_type: null,
						zipcode: '',
						street_complement: null,
						state: null,
						created_at: null,
						updated_at: null,
						deleted_at: null
					}
				],
				identity: [ { id: null, issuing_entity_id: null, number: '' } ],
				identityEmissor: [ { id: null, name: null } ],
				mother: [ { id: null, name: null } ],
				father: [ { id: null, name: null } ],
				country: [ { id: null, portuguese_name: null } ],
				city: [ { id: null, name: null } ],
				telephone: [ { id: null, ddd: null, telephones: null } ],
				email: [ { id: null, email: null } ]
			},
			internship: {
				type: 1,
				course: '',
				discipline: '',
				semYear: '',
				startDate: '',
				endDate: '',
				workload: 0,
				organization: {
					organization_type_id: 1,
					document_number: '',
					organization_name: '',
					phone1: '',
					phone2: '',
					fax: '',
					zipcode: '',
					street: '',
					complement: '',
					street_number: '',
					city: '',
					state: ''
				},
				documents: {
					contract: null,
					permit: null,
					plan: null,
					historic: null,
					diploma: null
				}
			}
		}
	};

	async componentDidMount() {
		this.toggleLoading();

		const { step, values } = JSON.parse(localStorage.getItem('internship_state')) || this.state;

		const resPersonal = await api.get('/student/65536').then((res) => res.data);
		const resOrganization = await api.get('organization').then((res) => {
			this.toggleLoading();
			return res.data.data;
		});

		this.setState({
			step: Math.min(step, 1),
			organizationOptions: resOrganization,
			values: {
				...values,
				personal: {
					...resPersonal
				}
			}
		});
	}

	toggleLoading = () => {
		const { loading } = this.state;
		this.setState({ loading: !loading });
	};

	previousStep = (e) => {
		e.preventDefault();
		const { step } = this.state;
		this.setState({ step: step - 1 });
	};

	nextStep = () => {
		const { step } = this.state;
		this.setState({ step: step + 1 });
	};

	clickStep = (step) => {
		this.setState({ step });
	};

	saveOnLocalStorage = (values) => {
		const { step, values: stateValues } = this.state;
		localStorage.setItem('internship_state', JSON.stringify({ step, values: { ...stateValues, ...values } }));
	};

	submit = async (valuesFormik) => {
		const { step, values: oldValues } = this.state;
		this.setState({ values: { ...oldValues, ...valuesFormik } });

		if (step === stepper.length - 1) {
			const { values } = this.state;
			const organization_id =
				JSON.stringify(values.organizationSelected) === '{}'
					? await api.post('organization', values.organization).then((res) => res.data.data.id)
					: values.organizationSelected.id;
			const student_id = 10;
			const user_id = 10;

			const internship_process_id = await api
				.post('/internship/process', {
					organization_id,
					user_id,
					student_id,
					internship_process_type_id: 1,
					internship_responsible: values.responsible.name,
					email_internship_responsible: values.responsible.email,
					phone1: values.responsible.phone1,
					phone2: values.responsible.phone2
				})
				.then((res) => res.data.process.id);

			const { values: { files } } = this.state;
			Object.keys(files).forEach((key, index) => {
				if (!files[key]) return;
				getBase64(files[key]).then(
					async (attachment) =>
						await api.post('/internship/document', {
							internship_process_id,
							document_type_id: index + 1,
							attachment
						})
				);
			});

			const { history } = this.props;
			Alert.success('Processo enviado com sucesso', {
				position: 'bottom-right',
				effect: 'slide'
			});
			history.push('/internship');
			localStorage.removeItem('internship_state');
		} else {
			this.nextStep();
			this.saveOnLocalStorage({});
		}
	};

	renderButtons() {
		const { step } = this.state;
		return (
			<GroupButton>
				{step ? (
					<Button secondary onClick={this.previousStep}>
						Voltar
					</Button>
				) : null}
				<Button primary type="submit">
					{step === stepper.length - 1 ? 'Concluir' : 'Próxima'}
				</Button>
			</GroupButton>
		);
	}

	render() {
		const { step, organizationOptions, values, loading } = this.state;
		const steps = [
			<StepPersonal handleSubmit={this.submit} values={values} buttons={this.renderButtons()} />,
			<StepOrganization
				handleSubmit={this.submit}
				saveChanges={this.saveOnLocalStorage}
				initialValues={values}
				organizationOptions={organizationOptions}
				buttons={this.renderButtons()}
			/>,
			<StepSummary handleSubmit={this.submit} values={values} buttons={this.renderButtons()} />
		];
		return (
			<Container>
				<LoadingScreen loading={loading} bgColor="#FFF" spinnerColor="#ED3B48" />
				<Stepper step={step} steps={stepper} clickStep={this.clickStep} />
				<Title>Nome da Disciplina de Estágio</Title>
				<Subtitle>Semestre e ano de oferta</Subtitle>
				{steps[step]}
			</Container>
		);
	}
}

export default StudentForm;
