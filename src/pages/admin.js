import {
	getNavbar,
	setupNavbarAuthActions,
	setupNavbarBurger,
	setupNavbarSectionLinks,
} from '../components/navbar.js';
import {
	getCurrentUser,
	getCurrentUserRole,
	isAuthenticated,
	logout,
} from '../utils/auth.js';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const RESOURCE_ORDER = ['skills', 'users', 'matches'];

const RESOURCE_CONFIG = {
	skills: {
		title: 'Habilidades registradas',
		endpointEnv: 'VITE_ADMIN_SKILLS_ENDPOINT',
		endpointFallbacks: ['/admin/skills', '/skills'],
		idAliases: ['id', 'skill_id'],
		collectionPaths: [
			'skills',
			'items',
			'results',
			'data.skills',
			'data.items',
			'data.results',
		],
		fields: [
			{
				key: 'name',
				label: 'Nombre',
				type: 'text',
				requiredOnCreate: true,
				aliases: ['name', 'skill_name', 'title'],
			},
			{
				key: 'category',
				label: 'Categoria',
				type: 'text',
				requiredOnCreate: false,
				aliases: ['category', 'type'],
			},
			{
				key: 'description',
				label: 'Descripcion',
				type: 'text',
				requiredOnCreate: false,
				aliases: ['description', 'detail', 'summary'],
			},
		],
		columns: [
			{ label: 'ID', aliases: ['id', 'skill_id'] },
			{ label: 'Nombre', aliases: ['name', 'skill_name', 'title'] },
			{ label: 'Categoria', aliases: ['category', 'type'] },
			{ label: 'Descripcion', aliases: ['description', 'detail', 'summary'] },
		],
	},
	users: {
		title: 'Usuarios registrados',
		endpointEnv: 'VITE_ADMIN_USERS_ENDPOINT',
		endpointFallbacks: ['/admin/users', '/users'],
		idAliases: ['id', 'user_id'],
		collectionPaths: [
			'users',
			'items',
			'results',
			'data.users',
			'data.items',
			'data.results',
		],
		fields: [
			{
				key: 'first_name',
				label: 'Nombre',
				type: 'text',
				requiredOnCreate: true,
				aliases: ['first_name', 'name', 'nombre'],
			},
			{
				key: 'last_name',
				label: 'Apellido',
				type: 'text',
				requiredOnCreate: true,
				aliases: ['last_name', 'surname', 'apellido'],
			},
			{
				key: 'email',
				label: 'Correo',
				type: 'email',
				requiredOnCreate: true,
				aliases: ['email', 'mail'],
			},
			{
				key: 'phone',
				label: 'Telefono',
				type: 'text',
				requiredOnCreate: false,
				aliases: ['phone', 'telefono', 'mobile'],
			},
			{
				key: 'role',
				label: 'Rol',
				type: 'text',
				requiredOnCreate: false,
				aliases: ['role', 'user_role'],
			},
			{
				key: 'password',
				label: 'Password',
				type: 'password',
				requiredOnCreate: false,
				aliases: ['password'],
			},
		],
		columns: [
			{ label: 'ID', aliases: ['id', 'user_id'] },
			{ label: 'Nombre', aliases: ['first_name', 'name', 'nombre'] },
			{ label: 'Apellido', aliases: ['last_name', 'surname', 'apellido'] },
			{ label: 'Correo', aliases: ['email', 'mail'] },
			{ label: 'Rol', aliases: ['role', 'user_role'] },
		],
	},
	matches: {
		title: 'Matches registrados',
		endpointEnv: 'VITE_ADMIN_MATCHES_ENDPOINT',
		endpointFallbacks: ['/admin/matches', '/matches'],
		idAliases: ['id', 'match_id', 'room_id'],
		collectionPaths: [
			'matches',
			'items',
			'results',
			'data.matches',
			'data.items',
			'data.results',
		],
		fields: [
			{
				key: 'user_from_id',
				label: 'Usuario origen',
				type: 'number',
				requiredOnCreate: true,
				aliases: ['user_from_id', 'user_1_id', 'from_user_id'],
			},
			{
				key: 'user_to_id',
				label: 'Usuario destino',
				type: 'number',
				requiredOnCreate: true,
				aliases: ['user_to_id', 'user_2_id', 'to_user_id'],
			},
			{
				key: 'status',
				label: 'Estado',
				type: 'text',
				requiredOnCreate: false,
				aliases: ['status', 'state'],
			},
			{
				key: 'room_id',
				label: 'Room ID',
				type: 'number',
				requiredOnCreate: false,
				aliases: ['room_id', 'chat_room_id'],
			},
		],
		columns: [
			{ label: 'ID', aliases: ['id', 'match_id', 'room_id'] },
			{ label: 'Usuario origen', aliases: ['user_from_id', 'user_1_id', 'from_user_id'] },
			{ label: 'Usuario destino', aliases: ['user_to_id', 'user_2_id', 'to_user_id'] },
			{ label: 'Estado', aliases: ['status', 'state'] },
			{ label: 'Room ID', aliases: ['room_id', 'chat_room_id'] },
		],
	},
};

const state = {
	activeResource: 'skills',
	endpoints: {
		stats: null,
		skills: null,
		users: null,
		matches: null,
	},
	resources: {
		skills: [],
		users: [],
		matches: [],
	},
	editing: {
		skills: null,
		users: null,
		matches: null,
	},
};

export async function AdminPage() {
	const app = document.getElementById('app');

	if (!isAuthenticated()) {
		const { HomePage } = await import('./home.js');
		HomePage();
		return;
	}

	if (getCurrentUserRole() !== 'admin') {
		const { ProfilePage } = await import('./profile.js');
		ProfilePage();
		return;
	}

	if (window.__homeCleanup) {
		window.__homeCleanup();
		window.__homeCleanup = null;
	}

	if (window.__homeScrollHandler) {
		window.removeEventListener('scroll', window.__homeScrollHandler);
		window.__homeScrollHandler = null;
	}

	if (window.__swapsCleanup) {
		window.__swapsCleanup();
		window.__swapsCleanup = null;
	}

	document.body.classList.remove(
		'auth-page',
		'register-mode',
		'profile-page',
		'swaps-page'
	);
	document.body.classList.add('admin-page');
	document.body.style.overflow = '';
	window.history.replaceState(null, '', '#admin');
	window.scrollTo({ top: 0, behavior: 'auto' });

	const user = getCurrentUser();
	const fullName = [user?.first_name || user?.name || 'Admin', user?.last_name]
		.filter(Boolean)
		.join(' ')
		.trim();

	app.innerHTML = `
		${getNavbar()}

		<main class="admin-main">
			<section class="admin-header">
				<div>
					<p class="admin-kicker">Panel Admin</p>
					<h1>Gestion general</h1>
					<p>Bienvenido ${escapeHtml(fullName || 'Administrador')}. Administra usuarios, habilidades y matches.</p>
				</div>
				<div class="admin-header-actions">
					<button id="admin-go-profile" class="admin-btn" type="button">Perfil</button>
					<button id="admin-go-swaps" class="admin-btn" type="button">Swaps</button>
					<button id="admin-logout" class="admin-btn admin-btn--danger" type="button">Cerrar sesion</button>
				</div>
			</section>

			<section class="admin-stats-grid" aria-label="Metricas">
				<article class="admin-stat-card">
					<span>Total usuarios</span>
					<strong id="stat-total-users">0</strong>
				</article>
				<article class="admin-stat-card">
					<span>Total matches</span>
					<strong id="stat-total-matches">0</strong>
				</article>
				<article class="admin-stat-card">
					<span>Total skills</span>
					<strong id="stat-total-skills">0</strong>
				</article>
				<article class="admin-stat-card">
					<span>Total user skills</span>
					<strong id="stat-total-user-skills">0</strong>
				</article>
			</section>
			<p id="stats-status" class="admin-status admin-status--muted">Cargando estadisticas...</p>

			<section class="admin-tabs" aria-label="Secciones CRUD">
				${RESOURCE_ORDER.map(
					(resource) => `
						<button
							type="button"
							class="admin-tab ${resource === state.activeResource ? 'is-active' : ''}"
							data-admin-tab="${resource}"
						>
							${escapeHtml(RESOURCE_CONFIG[resource].title)}
						</button>
					`
				).join('')}
			</section>

			<section class="admin-crud-sections">
				${RESOURCE_ORDER.map((resource) => renderCrudPanel(resource)).join('')}
			</section>
		</main>
	`;

	setupNavbarBurger();
	setupNavbarAuthActions();
	setupNavbarSectionLinks();

	setupAdminNavigationActions();
	setupTabActions();
	setupCrudActions();

	window.__swapsCleanup = () => {
		document.body.classList.remove('admin-page');
	};

	await loadStats();
	await Promise.all(RESOURCE_ORDER.map((resource) => loadResource(resource)));
	setActiveResource(state.activeResource);
}

function renderCrudPanel(resource) {
	const config = RESOURCE_CONFIG[resource];
	const headers = config.columns
		.map((column) => `<th>${escapeHtml(column.label)}</th>`)
		.join('');

	return `
		<article
			class="admin-crud-panel ${resource === state.activeResource ? 'is-active' : ''}"
			data-resource-panel="${resource}"
		>
			<div class="admin-panel-header">
				<h2>${escapeHtml(config.title)}</h2>
				<button
					type="button"
					class="admin-btn admin-btn--ghost"
					data-resource-refresh="${resource}"
				>
					Recargar
				</button>
			</div>

			<p id="status-${resource}" class="admin-status admin-status--muted">
				Cargando datos...
			</p>

			<form id="form-${resource}" class="admin-form-grid">
				${config.fields
					.map(
						(field) => `
							<label class="admin-form-field">
								<span>${escapeHtml(field.label)}</span>
								<input
									id="field-${resource}-${field.key}"
									type="${escapeHtml(field.type || 'text')}"
									placeholder="${escapeHtml(field.label)}"
								/>
							</label>
						`
					)
					.join('')}

				<div class="admin-form-actions">
					<button type="submit" id="submit-${resource}" class="admin-btn">Crear</button>
					<button
						type="button"
						id="cancel-${resource}"
						class="admin-btn admin-btn--ghost"
						data-resource-cancel="${resource}"
						hidden
					>
						Cancelar edicion
					</button>
				</div>
			</form>

			<div class="admin-table-wrapper">
				<table class="admin-table">
					<thead>
						<tr>
							${headers}
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody id="tbody-${resource}">
						<tr>
							<td colspan="${config.columns.length + 1}" class="admin-table-empty">Sin datos</td>
						</tr>
					</tbody>
				</table>
			</div>
		</article>
	`;
}

function setupAdminNavigationActions() {
	document.getElementById('admin-go-profile')?.addEventListener('click', () => {
		window.location.hash = '#profile';
	});

	document.getElementById('admin-go-swaps')?.addEventListener('click', () => {
		window.location.hash = '#swaps';
	});

	document.getElementById('admin-logout')?.addEventListener('click', () => {
		logout();
	});
}

function setupTabActions() {
	document.querySelectorAll('[data-admin-tab]').forEach((button) => {
		button.addEventListener('click', () => {
			const resource = button.getAttribute('data-admin-tab');
			if (!RESOURCE_CONFIG[resource]) return;
			setActiveResource(resource);
		});
	});
}

function setActiveResource(resource) {
	state.activeResource = resource;

	document.querySelectorAll('[data-admin-tab]').forEach((button) => {
		button.classList.toggle(
			'is-active',
			button.getAttribute('data-admin-tab') === resource
		);
	});

	document.querySelectorAll('[data-resource-panel]').forEach((panel) => {
		panel.classList.toggle(
			'is-active',
			panel.getAttribute('data-resource-panel') === resource
		);
	});
}

function setupCrudActions() {
	RESOURCE_ORDER.forEach((resource) => {
		document
			.getElementById(`form-${resource}`)
			?.addEventListener('submit', async (event) => {
				event.preventDefault();
				await submitResource(resource);
			});

		document
			.querySelector(`[data-resource-cancel="${resource}"]`)
			?.addEventListener('click', () => {
				resetForm(resource);
			});

		document
			.querySelector(`[data-resource-refresh="${resource}"]`)
			?.addEventListener('click', async () => {
				await loadResource(resource);
			});

		document.getElementById(`tbody-${resource}`)?.addEventListener('click', async (event) => {
			const button = event.target.closest('[data-row-action]');
			if (!button) return;

			const action = button.getAttribute('data-row-action');
			const index = Number.parseInt(button.getAttribute('data-row-index'), 10);
			const entity = state.resources[resource][index];

			if (!entity) return;

			if (action === 'edit') {
				startEditing(resource, entity);
			}

			if (action === 'delete') {
				await deleteEntity(resource, entity);
			}
		});
	});
}

async function submitResource(resource) {
	const config = RESOURCE_CONFIG[resource];
	const isEditing = Boolean(state.editing[resource]);
	const payload = buildPayloadFromForm(resource, config.fields, isEditing);

	if (!payload) return;

	try {
		if (isEditing) {
			await requestResource(resource, {
				method: 'PUT',
				id: state.editing[resource],
				payload,
			});
			setResourceStatus(resource, 'Registro actualizado correctamente.', 'success');
		} else {
			await requestResource(resource, {
				method: 'POST',
				payload,
			});
			setResourceStatus(resource, 'Registro creado correctamente.', 'success');
		}

		resetForm(resource);
		await loadResource(resource, { silentSuccessStatus: true });
	} catch (error) {
		setResourceStatus(
			resource,
			error.message || 'No fue posible guardar el registro.',
			'error'
		);
	}
}

async function deleteEntity(resource, entity) {
	const config = RESOURCE_CONFIG[resource];
	const entityId = getFieldByAliases(entity, config.idAliases);

	if (entityId === null || entityId === undefined || entityId === '') {
		setResourceStatus(resource, 'El registro no tiene un ID valido.', 'error');
		return;
	}

	const shouldDelete = window.confirm('Deseas eliminar este registro?');
	if (!shouldDelete) return;

	try {
		await requestResource(resource, {
			method: 'DELETE',
			id: entityId,
		});

		if (String(state.editing[resource]) === String(entityId)) {
			resetForm(resource);
		}

		setResourceStatus(resource, 'Registro eliminado correctamente.', 'success');
		await loadResource(resource, { silentSuccessStatus: true });
	} catch (error) {
		setResourceStatus(
			resource,
			error.message || 'No fue posible eliminar el registro.',
			'error'
		);
	}
}

function startEditing(resource, entity) {
	const config = RESOURCE_CONFIG[resource];
	const entityId = getFieldByAliases(entity, config.idAliases);

	if (entityId === null || entityId === undefined || entityId === '') {
		setResourceStatus(resource, 'No se puede editar: registro sin ID.', 'error');
		return;
	}

	state.editing[resource] = entityId;

	config.fields.forEach((field) => {
		const input = document.getElementById(`field-${resource}-${field.key}`);
		if (!input) return;
		const value = getFieldByAliases(entity, field.aliases);
		input.value = value === undefined || value === null ? '' : String(value);
	});

	const submitButton = document.getElementById(`submit-${resource}`);
	if (submitButton) {
		submitButton.textContent = 'Actualizar';
	}

	const cancelButton = document.getElementById(`cancel-${resource}`);
	if (cancelButton) {
		cancelButton.hidden = false;
	}

	setResourceStatus(resource, 'Modo edicion activo.', 'muted');
}

function resetForm(resource) {
	const config = RESOURCE_CONFIG[resource];

	state.editing[resource] = null;
	config.fields.forEach((field) => {
		const input = document.getElementById(`field-${resource}-${field.key}`);
		if (input) input.value = '';
	});

	const submitButton = document.getElementById(`submit-${resource}`);
	if (submitButton) {
		submitButton.textContent = 'Crear';
	}

	const cancelButton = document.getElementById(`cancel-${resource}`);
	if (cancelButton) {
		cancelButton.hidden = true;
	}
}

function buildPayloadFromForm(resource, fields, isEditing) {
	const payload = {};
	const missingRequired = [];

	fields.forEach((field) => {
		const input = document.getElementById(`field-${resource}-${field.key}`);
		const rawValue = input?.value?.trim() || '';

		if (!rawValue) {
			if (!isEditing && field.requiredOnCreate) {
				missingRequired.push(field.label);
			}
			return;
		}

		payload[field.key] = normalizePayloadValue(field.key, rawValue);
	});

	if (missingRequired.length > 0) {
		setResourceStatus(
			resource,
			`Campos obligatorios: ${missingRequired.join(', ')}.`,
			'error'
		);
		return null;
	}

	if (Object.keys(payload).length === 0) {
		setResourceStatus(resource, 'Debes ingresar al menos un valor.', 'error');
		return null;
	}

	return payload;
}

function normalizePayloadValue(key, value) {
	if (key.endsWith('_id')) {
		const numeric = Number.parseInt(value, 10);
		return Number.isNaN(numeric) ? value : numeric;
	}

	return value;
}

async function loadStats() {
	const statusElement = document.getElementById('stats-status');

	if (statusElement) {
		statusElement.textContent = 'Cargando estadisticas...';
		statusElement.className = 'admin-status admin-status--muted';
	}

	const candidates = getStatsEndpointCandidates();
	let lastError = null;

	for (const endpoint of candidates) {
		try {
			const payload = await callApi(endpoint, { method: 'GET' });
			state.endpoints.stats = endpoint;
			applyStats(payload || {});

			if (statusElement) {
				statusElement.textContent = 'Estadisticas cargadas.';
				statusElement.className = 'admin-status admin-status--success';
			}
			return;
		} catch (error) {
			lastError = error;
			if (error.status !== 404 && error.status !== 405) {
				break;
			}
		}
	}

	applyStats({});

	if (statusElement) {
		statusElement.textContent =
			lastError?.message || 'No se pudieron cargar las estadisticas.';
		statusElement.className = 'admin-status admin-status--error';
	}
}

function applyStats(stats = {}) {
	document.getElementById('stat-total-users').textContent = String(
		toSafeNumber(stats.total_users)
	);
	document.getElementById('stat-total-matches').textContent = String(
		toSafeNumber(stats.total_matches)
	);
	document.getElementById('stat-total-skills').textContent = String(
		toSafeNumber(stats.total_skills)
	);
	document.getElementById('stat-total-user-skills').textContent = String(
		toSafeNumber(stats.total_user_skills)
	);
}

async function loadResource(resource, options = {}) {
	const { silentSuccessStatus = false } = options;

	setResourceStatus(resource, 'Cargando registros...', 'muted');

	try {
		const payload = await requestResource(resource, { method: 'GET' });
		const items = extractCollection(payload, resource);
		state.resources[resource] = items;

		renderResourceTable(resource);
		if (!silentSuccessStatus) {
			const amount = items.length;
			setResourceStatus(
				resource,
				`${amount} ${amount === 1 ? 'registro cargado' : 'registros cargados'}.`,
				'success'
			);
		}
	} catch (error) {
		state.resources[resource] = [];
		renderResourceTable(resource);
		setResourceStatus(
			resource,
			error.message || 'No se pudo cargar la informacion.',
			'error'
		);
	}
}

function renderResourceTable(resource) {
	const config = RESOURCE_CONFIG[resource];
	const rows = state.resources[resource];
	const body = document.getElementById(`tbody-${resource}`);

	if (!body) return;

	if (!Array.isArray(rows) || rows.length === 0) {
		body.innerHTML = `
			<tr>
				<td colspan="${config.columns.length + 1}" class="admin-table-empty">
					No hay registros para mostrar.
				</td>
			</tr>
		`;
		return;
	}

	body.innerHTML = rows
		.map((row, index) => {
			const idValue = getFieldByAliases(row, config.idAliases);
			const hasId = idValue !== null && idValue !== undefined && idValue !== '';
			const columnsHtml = config.columns
				.map((column) => {
					const value = getFieldByAliases(row, column.aliases);
					return `<td>${escapeHtml(value === undefined || value === null || value === '' ? '-' : value)}</td>`;
				})
				.join('');

			return `
				<tr>
					${columnsHtml}
					<td class="admin-actions-cell">
						<button
							type="button"
							class="admin-btn admin-btn--ghost admin-btn--small"
							data-row-action="edit"
							data-row-index="${index}"
							${hasId ? '' : 'disabled'}
						>
							Editar
						</button>
						<button
							type="button"
							class="admin-btn admin-btn--danger admin-btn--small"
							data-row-action="delete"
							data-row-index="${index}"
							${hasId ? '' : 'disabled'}
						>
							Eliminar
						</button>
					</td>
				</tr>
			`;
		})
		.join('');
}

function extractCollection(payload, resource) {
	if (Array.isArray(payload)) return payload;
	if (!payload || typeof payload !== 'object') return [];

	const config = RESOURCE_CONFIG[resource];
	const paths = [
		...(config.collectionPaths || []),
		resource,
		'items',
		'results',
		'data',
	];

	for (const path of paths) {
		const value = getPath(payload, path);
		if (Array.isArray(value)) return value;
	}

	return [];
}

async function requestResource(resource, requestOptions) {
	const { method, id = null, payload = null } = requestOptions;

	const candidates = [];
	const resolvedEndpoint = state.endpoints[resource];
	if (resolvedEndpoint) {
		candidates.push(resolvedEndpoint);
	}

	getResourceEndpointCandidates(resource).forEach((endpoint) => {
		if (!candidates.includes(endpoint)) {
			candidates.push(endpoint);
		}
	});

	let lastError = null;

	for (const baseEndpoint of candidates) {
		const url =
			id === null || id === undefined
				? baseEndpoint
				: `${baseEndpoint.replace(/\/$/, '')}/${encodeURIComponent(String(id))}`;

		try {
			const response = await callApi(url, {
				method,
				body: payload,
			});
			state.endpoints[resource] = baseEndpoint;
			return response;
		} catch (error) {
			lastError = error;

			const shouldTryNextEndpoint =
				error.status === 404 || error.status === 405 || error.status === 501;

			if (!shouldTryNextEndpoint) {
				throw error;
			}
		}
	}

	throw (
		lastError ||
		new Error(`No se encontro endpoint disponible para ${RESOURCE_CONFIG[resource].title}.`)
	);
}

async function callApi(url, options = {}) {
	const { method = 'GET', body = null } = options;

	const headers = {};
	const token = localStorage.getItem('token');
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const requestOptions = {
		method,
		headers,
	};

	if (body !== null && body !== undefined) {
		headers['Content-Type'] = 'application/json';
		requestOptions.body = JSON.stringify(body);
	}

	const response = await fetch(url, requestOptions);

	let parsedBody = null;
	const contentType = response.headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		try {
			parsedBody = await response.json();
		} catch {
			parsedBody = null;
		}
	} else {
		try {
			const text = await response.text();
			parsedBody = text ? { message: text } : null;
		} catch {
			parsedBody = null;
		}
	}

	if (!response.ok) {
		if (response.status === 401) {
			forceLogoutToLogin();
		}

		const message =
			parsedBody?.message ||
			parsedBody?.detail ||
			parsedBody?.error ||
			`HTTP ${response.status}`;

		const error = new Error(message);
		error.status = response.status;
		throw error;
	}

	return parsedBody ?? {};
}

function forceLogoutToLogin() {
	localStorage.removeItem('token');
	localStorage.removeItem('userData');
	localStorage.removeItem('currentUser');
	localStorage.removeItem('user_id');
	localStorage.removeItem('role');
	localStorage.removeItem('pendingOnboarding');

	import('./login.js').then(({ LoginPage }) => {
		LoginPage('login');
	});
}

function getResourceEndpointCandidates(resource) {
	const config = RESOURCE_CONFIG[resource];
	const envValue = import.meta.env[config.endpointEnv];

	if (envValue) {
		return [toAbsoluteUrl(envValue)];
	}

	return config.endpointFallbacks.map((path) => toAbsoluteUrl(path));
}

function getStatsEndpointCandidates() {
	const envValue = import.meta.env.VITE_ADMIN_STATS_ENDPOINT;
	if (envValue) {
		return [toAbsoluteUrl(envValue)];
	}

	return ['/stats', '/admin/stats'].map((path) => toAbsoluteUrl(path));
}

function toAbsoluteUrl(path) {
	const value = String(path || '').trim();
	if (!value) return API_URL;

	if (value.startsWith('http://') || value.startsWith('https://')) {
		return value.replace(/\/$/, '');
	}

	if (!API_URL) {
		return value;
	}

	const normalizedPath = value.startsWith('/') ? value : `/${value}`;
	return `${API_URL}${normalizedPath}`.replace(/\/$/, '');
}

function setResourceStatus(resource, message, tone = 'muted') {
	const statusElement = document.getElementById(`status-${resource}`);
	if (!statusElement) return;

	statusElement.textContent = message;
	statusElement.className = `admin-status admin-status--${tone}`;
}

function getFieldByAliases(entity, aliases = []) {
	if (!entity || typeof entity !== 'object') return null;

	for (const alias of aliases) {
		if (entity[alias] !== undefined && entity[alias] !== null) {
			return entity[alias];
		}
	}

	return null;
}

function getPath(payload, path) {
	if (!path) return payload;

	return path.split('.').reduce((acc, segment) => {
		if (acc && typeof acc === 'object') {
			return acc[segment];
		}
		return undefined;
	}, payload);
}

function toSafeNumber(value) {
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? 0 : parsed;
}

function escapeHtml(value = '') {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

