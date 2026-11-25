# TalentVibe · Evaluación psicométrica y contratación de creadores de TikTok

Proyecto de Figma con Metodologia DDD · Ingeniería en Sistemas de Información
**Repositorio:** <a href="https://github.com/Crash0015/TalentVibe_Grupo3.git" target="_blank" rel="noopener noreferrer">Crash0015/TalentVibe_Grupo3</a>
**JIRA** <a href="https://alex217.atlassian.net/jira/software/projects/STK/list?jql=project+%3D+STK+ORDER+BY+cf%5B10019%5D+ASC&atlOrigin=eyJpIjoiZGJkYzA2MzQ5YjU5NDFjNWEyODFkZTIxNmRhZTI5NjQiLCJwIjoiaiJ9" target="_blank" rel="noopener noreferrer">Actividades y Tareas</a>
**Diseño en Figma:** <a href="https://www.figma.com/design/uo8Zwg8EMhe8CWq1HBwRu2/TalentVibe?m=auto&amp;t=m7U2prMdyCX2bBrd-6" target="_blank" rel="noopener noreferrer">TalentVibe · Línea Gráfica y Prototipo</a>

TalentVibe es una aplicación móvil desarrollada con **Expo + React Native** que permite a las marcas evaluar la compatibilidad psicológica de creadores de TikTok con el modelo **Big Five (OCEAN)** antes de contratarlos. La app analiza cinco rasgos de personalidad, calcula un nivel de riesgo reputacional a partir de señales de controversia y ofrece un sistema de descubrimiento tipo *swipe* para decidir rápido y con evidencia.

El prototipo funciona íntegramente en **Expo Go**, sin backend ni compilación nativa: la autenticación, el análisis psicométrico, el mazo de tarjetas y las propuestas de campaña corren sobre repositorios *mock* persistentes en memoria/AsyncStorage.

## Integrantes del Equipo (Grupo 3)

| Integrante | Aporte principal |
|---|---|
| **Cristian Alejandro Pilapanta Valdez** | Arranque en Expo Go, diseño DDD, backend en capas: motor de extraccion, auditoria Benford, Big Five con evidencia y CLI. |
| **Dylan Alexander Paez Aguirre** | Maquetacion y estilos de *dashboards* de empresa y creador. |
| **Steven Alexander Saragosin Robalino** | Refinamiento de estilos de componentes reutilizables, tema tipografico y de color, espaciado y alineacion de pantallas, y consistencia de nombres en el proyecto. |
| **Elein Lizeth Inaquiza Mejia** | Documentacion del proyecto y estructuracion de informes academicos. |

---

## 1. Problema que resuelve

La contratación de creadores de TikTok suele decidirse por **métricas de vanidad**: vistas, seguidores y likes. Esas cifras no dicen nada sobre tres cosas que sí impactan a una marca:

- **Compatibilidad psicológica** con la cultura de la empresa y el tono de su audiencia.
- **Riesgo reputacional** por historial de controversias, lenguaje polémico o reportes de seguridad de marca.
- **Costo de una mala contratación**: una campaña fallida, una crisis de marca o un contrato que hay que rescindir.

TalentVibe traslada esa evaluación al inicio del embudo: en lugar de descartar perfiles después de la campaña, la marca **descarta perfiles polémicos antes del swipe** y contrata creadores cuya personalidad y comportamiento público ya fueron medidos.

---

## 2. Modelo de negocio y propuesta de valor

### Dos roles, un mismo motor de compatibilidad

| Rol | Qué obtiene |
|---|---|
| **COMPANY (Marca)** | Directorio de creadores con Big Five, puntaje de riesgo TikTok, swipe para aprobar/descartar, matches aprobados y envío de propuestas de campaña. |
| **CREATOR (Creador)** | Sincronización de su perfil de TikTok, reporte Big Five personal, nivel de compatibilidad con el perfil cultural de las marcas y estado de su cuenta. |

### Motor psicométrico Big Five (OCEAN)

Los cinco rasgos se miden de **0 a 100** y se expresan con el lenguaje de producto de TalentVibe:

| Rasgo OCEAN | Nombre en TalentVibe | Qué mide |
|---|---|---|
| Openness | **Innovación** | Apertura a nuevas ideas y formatos de contenido. |
| Conscientiousness | **Autogestión** | Disciplina, cumplimiento de entregas y responsabilidad. |
| Extraversion | **Comunicación** | Claridad expresiva y energía frente a cámara. |
| Agreeableness | **Empatía** | Colaboración, respeto y trato con comunidades. |
| Neuroticism (estabilidad) | **Resiliencia** | Manejo de la presión y de la crítica pública. |

**Afinidad** (`BigFiveProfile.affinityWith`): distancia media absoluta entre los cinco rasgos del creador y el perfil cultural de la marca; `100` es coincidencia exacta.

**Riesgo reputacional** (`riskAssessment.ts`):

```text
score = flaggedPosts×8 + controversyMentions×5 + brandSafetyReports×20
      + (30 − empatía)×0.6      si empatía       < 30
      + (30 − autogestión)×0.5  si autogestión   < 30
      + (30 − resiliencia)×0.3  si resiliencia   < 30
score = min(100, round(score))

LOW_RISK < 25 ≤ MEDIUM_RISK < 55 ≤ HIGH_RISK
```

Un perfil `HIGH_RISK` queda excluido del mazo de descubrimiento por defecto: la marca solo ve candidatos `LOW_RISK` y `MEDIUM_RISK`, y puede filtrar además por afinidad mínima y búsqueda por nombre/@usuario.

### Flujo de valor

```text
Marca                              Creador
  │                                   │
  ├─ Explora mazo (swipe) ────────────┤
  │    LEFT  = descartar              │
  │    RIGHT = match                  │
  ├─ Match aprobado                   │
  ├─ Reporte Big Five + riesgo        │
  ├─ Propuesta de campaña ───────────▶│
  │                                   │
  └──────── contratación ágil ────────┘
```

---

## Criterios de Selección del Prototipo

Antes de escribir la primera línea de código, el equipo evaluó varias propuestas visuales. Se seleccionó el archivo **TalentVibe** (`fileKey uo8Zwg8EMhe8CWq1HBwRu2`) por encima de las demás alternativas por cuatro razones determinantes:

- **Separación estricta entre Sistema de Diseño y Prototipo.** El archivo dedica una página exclusiva a la **Línea Gráfica** (nodo `35-6`) y otra al **Prototipo navegable** (nodo `0-1`). Esa división evita estilos dispersos o inconsistentes, establece una única fuente de verdad para los tokens y permite distinguir con claridad qué es reutilizable y qué es composición de producto.
- **Madurez para Atomic Design.** Los componentes visuales ya estaban conceptualizados bajo jerarquías reutilizables: paleta y roles de color, escalas tipográficas con tracking e interlineado, radios, sombras, átomos (botones, badges, avatares, inputs) y moléculas (tarjeta de candidato, fila Big Five). Eso permitió mapearlos directamente a `src/presentation/components/atoms`, `molecules` y `organisms` sin rediseñar la interfaz ni improvisar variantes.
- **Integración óptima con el servidor MCP de Figma.** La estructura ordenada por nodos hizo posible que el agente extrajera programáticamente paletas, radios, sombras y medidas exactas, además de las tipografías y sus interlineados. El resultado fue un `theme/` derivado del archivo real, sin valores visuales hardcodeados en pantallas ni componentes.
- **Alineación natural con Domain-Driven Design (DDD).** Los flujos funcionales del diseño —autenticación por roles, evaluación psicométrica Big Five (OCEAN), descubrimiento tipo swipe y gestión de la contratación— delimitan con claridad cuatro Bounded Contexts independientes (`auth`, `psychometric`, `discovery`, `hiring`). Esa correspondencia entre diseño y dominio hizo viable construir un MVP funcional, mantenible y escalable sobre Expo Go.

En conjunto, el prototipo elegido no solo era el más completo visualmente: su organización interna funcionó como contrato de arquitectura, reduciendo retrabajo y permitiendo avanzar por capas con validación de tipos en cada micro-tarea.

## 2.1. Análisis del dominio y lenguaje ubicuo

### Dominio del proyecto

El dominio principal de TalentVibe se centra en la evaluación de compatibilidad entre marcas y creadores de contenido de TikTok, mediante el análisis de características psicométricas y señales de riesgo reputacional. El sistema busca facilitar la selección de creadores que se ajusten a la identidad y los valores de una marca, proporcionando información que apoye el proceso de contratación y colaboración.

Para representar este dominio, TalentVibe utiliza el modelo Big Five (OCEAN), un indicador de afinidad entre perfiles y una valoración heurística del riesgo reputacional. Estos elementos permiten organizar las funcionalidades del sistema de acuerdo con las necesidades del negocio.



### Lenguaje ubicuo

El lenguaje ubicuo establece un vocabulario compartido entre los integrantes del equipo, el dominio del negocio y la implementación del software. Su finalidad es garantizar que los conceptos utilizados durante el análisis, diseño y desarrollo mantengan un significado consistente, evitando interpretaciones diferentes de una misma funcionalidad.

En TalentVibe, los siguientes términos representan los conceptos principales del dominio:

| Término | Descripción |
|---|---|
| **COMPANY** | Usuario que representa a una marca o empresa interesada en contratar creadores de contenido. |
| **CREATOR** | Usuario que representa a un creador de contenido que busca oportunidades de colaboración con marcas. |
| **Big Five** | Modelo de personalidad compuesto por cinco dimensiones: apertura, responsabilidad, extraversión, amabilidad y neuroticismo. |
| **Affinity Score** | Indicador que representa el nivel de compatibilidad entre el perfil de personalidad de una marca y el de un creador. |
| **Risk Score** | Indicador heurístico que estima el nivel de riesgo reputacional de un creador. |
| **Discovery** | Proceso mediante el cual una marca explora perfiles de creadores disponibles en la plataforma. |
| **Swipe** | Acción de deslizar una tarjeta de perfil para expresar interés o descartarla. |
| **Match** | Coincidencia generada entre una marca y un creador como resultado del proceso de selección. |
| **Campaign Proposal** | Propuesta de colaboración relacionada con una campaña que una marca envía a un creador. |
| **Bounded Context** | Límite que delimita un modelo y sus responsabilidades dentro del sistema, manteniendo separados los conceptos de cada área funcional. |

Este vocabulario se utiliza como referencia para mantener la coherencia entre los conceptos del negocio, los nombres de las entidades, las reglas de dominio y la organización del código fuente.

### Reglas de negocio

El funcionamiento de TalentVibe se fundamenta en las siguientes reglas de negocio:

- La compatibilidad entre una marca y un creador se calcula comparando sus cinco dimensiones de personalidad mediante el modelo Big Five.
- El riesgo reputacional se estima mediante indicadores relacionados con publicaciones señaladas, menciones de controversias, reportes de seguridad de marca y determinadas puntuaciones de personalidad.
- Los perfiles clasificados con riesgo reputacional alto (`HIGH_RISK`) se excluyen del proceso de descubrimiento por defecto.
- Las funcionalidades disponibles dentro de la aplicación dependen del rol del usuario (`COMPANY` o `CREATOR`).
- Las marcas pueden explorar perfiles, expresar interés o descartar candidatos y gestionar propuestas de colaboración.

Estas reglas orientan el comportamiento del sistema y permiten mantener la lógica del negocio independiente de la interfaz de usuario.

### Relación del lenguaje ubicuo con la arquitectura DDD

El lenguaje ubicuo se refleja directamente en la organización del código fuente mediante cuatro Bounded Contexts, cada uno con responsabilidades específicas dentro del dominio de TalentVibe:

| Bounded Context | Responsabilidad | Conceptos relacionados |
|---|---|---|
| **auth** | Gestionar la autenticación, el registro y las sesiones de los usuarios. | COMPANY, CREATOR, User, Email. |
| **psychometric** | Gestionar los perfiles de personalidad, el análisis Big Five, la afinidad y el riesgo reputacional. | Big Five, Affinity Score, Risk Score. |
| **discovery** | Gestionar la exploración de perfiles, los filtros y las decisiones de selección mediante swipe. | Discovery, Swipe, Candidate. |
| **hiring** | Gestionar las coincidencias aprobadas y las propuestas de colaboración. | Match, Campaign Proposal. |

Esta separación permite que cada contexto mantenga sus propias responsabilidades y modelos de dominio, facilitando el mantenimiento, la evolución y la comprensión del sistema.

La aplicación de este enfoque permite que el vocabulario del negocio se mantenga alineado con la implementación técnica, fortaleciendo la comunicación entre los integrantes del equipo y la organización del software mediante Domain-Driven Design (DDD).

---

## 3. Arquitectura de software: DDD + Atomic Design

### 3.1 Por qué Domain-Driven Design

El proyecto aplica DDD táctico con cuatro **Bounded Contexts** independientes y tres capas internas por contexto. La decisión se justifica en:

1. **Reglas de negocio puras, sin React/Expo.** `domain/` no importa React, Expo ni React Native. La afinidad, el riesgo reputacional, las invariantes del correo y del perfil Big Five se prueban y razonan sin depender de la UI.
2. **Escalabilidad de mock a API real.** `domain/` declara puertos (`AuthRepository`, `PsychometricRepository`, `DiscoveryRepository`, `HiringRepository`); `infrastructure/` los implementa con mocks. Reemplazar un mock por una API REST solo cambia infraestructura y el *composition root* (`create*Module`), sin tocar pantallas ni casos de uso.
3. **Aislamiento por contexto.** Auth no conoce psicometría; discovery no importa entidades de psychometric (replica solo su unión de riesgo); hiring consume datos planos. Cada contexto puede evolucionar o incluso extraerse a otro servicio sin arrastrar a los demás.
4. **Inyección de dependencias explícita.** Cada contexto expone una función `createXModule()` que ensambla repositorio + casos de uso. La presentación depende de esas funciones, no de implementaciones concretas.

### 3.2 Capas por módulo

```text
src/modules/<contexto>/
├── domain/          # Entidades, Value Objects, reglas puras, puertos. Cero React/Expo.
├── application/     # Casos de uso: orquestan dominio + puertos, devuelven DTOs planos.
└── infrastructure/  # Adaptadores mock: AsyncStorage/memoria y composition roots.
```

### 3.3 Árbol de directorios real

```text
TalentVibe_Grupo3/
├── App.tsx                      # RootNavigator + AuthProvider (navegación por sesión y rol)
├── index.ts                     # registerRootComponent(App)
├── app.json                     # Configuración Expo (TalentVibe, portrait, light)
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Extiende expo/tsconfig.base + strict: true
├── AGENTS.md                    # Reglas del proyecto (Expo, DDD, Figma MCP, commits)
├── assets/                      # Íconos y recursos de Expo
└── src/
    ├── core/                    # Reservado para utilidades transversales (placeholder)
    ├── modules/
    │   ├── auth/                        # Bounded Context: identidad y sesión
    │   │   ├── domain/
    │   │   │   ├── AuthError.ts         # Error tipado por código
    │   │   │   ├── Email.ts             # Value Object (normaliza y valida)
    │   │   │   ├── User.ts              # Entidad User + rol COMPANY | CREATOR
    │   │   │   ├── AuthRepository.ts    # Puerto login/register/logout/sesión
    │   │   │   └── index.ts
    │   │   ├── application/
    │   │   │   ├── LoginUseCase.ts
    │   │   │   ├── RegisterUseCase.ts
    │   │   │   ├── LogoutUseCase.ts
    │   │   │   ├── GetCurrentSessionUseCase.ts
    │   │   │   └── index.ts
    │   │   └── infrastructure/
    │   │       ├── KeyValueStorage.ts             # Puerto de almacenamiento
    │   │       ├── AsyncStorageKeyValueStorage.ts # Persistencia Expo Go
    │   │       ├── InMemoryKeyValueStorage.ts     # Tests / fallback
    │   │       ├── mockAccounts.ts                # 1 marca + 1 creador demo
    │   │       ├── MockAuthRepository.ts          # Login/registro/sesión simulados
    │   │       ├── createAuthModule.ts            # Composition root
    │   │       └── index.ts
    │   ├── psychometric/                # Bounded Context: Big Five y riesgo TikTok
    │   │   ├── domain/
    │   │   │   ├── BigFiveProfile.ts    # VO 0-100 en 5 rasgos + afinidad
    │   │   │   ├── riskAssessment.ts    # Regla pura de riesgo reputacional
    │   │   │   ├── PsychometricAnalysis.ts
    │   │   │   ├── PsychometricError.ts
    │   │   │   ├── PsychometricRepository.ts
    │   │   │   └── index.ts
    │   │   ├── application/
    │   │   │   ├── AnalyzeTikTokCreatorUseCase.ts
    │   │   │   ├── GetCreatorPsychometricReportUseCase.ts
    │   │   │   ├── CreatorPsychometricReport.ts   # DTO plano
    │   │   │   └── index.ts
    │   │   └── infrastructure/
    │   │       ├── mockCreatorProfiles.ts         # 6 perfiles (seguros y polémicos)
    │   │       ├── MockPsychometricRepository.ts
    │   │       ├── createPsychometricModule.ts
    │   │       └── index.ts
    │   ├── discovery/                   # Bounded Context: mazo y filtros
    │   │   ├── domain/
    │   │   │   ├── DiscoveryModels.ts   # Candidato, filtros, swipe, puerto y error
    │   │   │   └── SwipeDeck.ts         # Mazo puro (cursor, LEFT/RIGHT)
    │   │   ├── application/
    │   │   │   ├── GetDiscoveryDeckUseCase.ts
    │   │   │   └── SwipeCandidateUseCase.ts
    │   │   └── infrastructure/
    │   │       ├── MockDiscoveryRepository.ts
    │   │       └── createDiscoveryModule.ts
    │   └── hiring/                      # Bounded Context: matches y propuestas
    │       ├── domain/
    │       │   └── HiringModels.ts      # Match, CampaignProposal, puerto y error
    │       ├── application/
    │       │   ├── GetApprovedMatchesUseCase.ts
    │       │   └── SendCampaignProposalUseCase.ts
    │       └── infrastructure/
    │           ├── MockHiringRepository.ts
    │           └── createHiringModule.ts
    └── presentation/                    # Atomic Design + tema + estado de sesión
        ├── theme/
        │   ├── colors.ts                # Paleta y roles semánticos desde Figma
        │   ├── typography.ts            # Inter, escala, line-height, tracking
        │   ├── spacing.ts               # Spacing, radios, tamaños, sombras
        │   └── index.ts
        ├── context/
        │   └── AuthContext.tsx          # user, isLoading, login, register, logout
        ├── components/
        │   ├── atoms/
        │   │   ├── AppText.tsx
        │   │   ├── AppButton.tsx
        │   │   ├── AppInput.tsx
        │   │   ├── Badge.tsx
        │   │   ├── ProgressBar.tsx
        │   │   ├── Avatar.tsx
        │   │   └── index.ts
        │   ├── molecules/
        │   │   ├── CandidateCard.tsx
        │   │   ├── MatchStat.tsx
        │   │   ├── BigFiveTraitRow.tsx
        │   │   ├── SearchBar.tsx
        │   │   └── index.ts
        │   └── organisms/
        │       ├── SwipeDeckView.tsx    # PanResponder + Animated (sin deps nativas)
        │       ├── CandidateList.tsx
        │       ├── BigFiveReportCard.tsx
        │       ├── BottomTabBar.tsx
        │       └── index.ts
        └── screens/
            ├── WelcomeScreen.tsx
            ├── LoginScreen.tsx
            ├── RegisterScreen.tsx
            ├── CompanyHomeScreen.tsx
            ├── CreatorHomeScreen.tsx
            └── index.ts
```

### 3.4 Flujo de una acción

```text
Pantalla (presentation)
   │  llama al caso de uso del módulo
   ▼
Application (use case)
   │  valida entrada y orquesta
   ▼
Domain (entidad / VO / regla pura)
   │  declara el puerto
   ▼
Infrastructure (MockRepository)
   │  AsyncStorage / memoria
   ▼
DTO plano → estado de React → UI
```

> Regla del proyecto: ningún archivo de `domain/` importa React, Expo ni React Native. Lo verifica la revisión manual y el tipado estricto (`npx tsc --noEmit`).

---

## 4. Mapa tecnológico, librerías y dependencias

Versiones exactas tomadas de `package.json`.

### Dependencias de ejecución

| Librería | Versión | Para qué se usa en TalentVibe | Por qué se eligió |
|---|---|---|---|
| **expo** | `~58.0.26` | SDK que provee el runtime, Metro, el arranque de la app y el soporte de Expo Go. | Es la vía oficial para correr en Expo Go sin compilar nativo; fija versiones compatibles entre React Native y sus módulos. |
| **react** | `19.3.0` | Librería de UI: componentes, hooks y estado de las pantallas. | Versión exigida por React Native 0.88 / Expo SDK 58; sin ella no hay reconciler. |
| **react-native** | `0.88.1` | Componentes nativos (`View`, `Text`, `Pressable`, `Animated`, `PanResponder`, `FlatList`), `SafeAreaView` y `StyleSheet`. | Es el motor móvil que Expo Go incluye; permite swipe y animaciones sin módulos adicionales. |
| **expo-status-bar** | `~58.0.5` | Controla el estilo de la barra de estado (`dark`) de forma consistente en Android e iOS. | Módulo oficial de Expo, incluido en Expo Go, sin configuración nativa. |
| **@react-native-async-storage/async-storage** | `2.2.0` | Persistencia de usuarios registrados y de la sesión activa (`@talentvibe/auth/users` y `@talentvibe/auth/session`). | Módulo nativo incluido en Expo Go; permite restaurar sesión al abrir la app sin backend ni *dev client*. API estable y compatible con SDK 58. |

### Dependencias de desarrollo

| Librería | Versión | Para qué se usa en TalentVibe | Por qué se eligió |
|---|---|---|---|
| **typescript** | `~6.0.3` | Compilación y verificación de tipos con `tsc --noEmit`; fuente de los tipos de dominio y DTOs. | Tipado estricto (`strict: true`) que protege las reglas de negocio y los contratos entre capas; no añade peso al bundle. |
| **@types/react** | `~19.3.0` | Tipos de React para componentes `.tsx` (props, hooks, `ReactNode`). | Necesario para que TypeScript entienda React 19; solo existe en desarrollo. |

### Scripts disponibles

| Script | Comando | Uso |
|---|---|---|
| `npm start` | `expo start` | Levanta Metro y muestra el QR para Expo Go. |
| `npm run android` | `expo start --android` | Abre la app en un emulador/dispositivo Android conectado. |
| `npm run ios` | `expo start --ios` | Abre la app en un simulador iOS (macOS). |
| `npm run web` | `expo start --web` | Arranque web experimental; requiere instalar `react-dom` y `react-native-web`, que no forman parte de este `package.json`. |

### Configuración

- `app.json`: nombre **TalentVibe**, orientación vertical, `userInterfaceStyle: light`, íconos adaptativos Android.
- `tsconfig.json`: extiende `expo/tsconfig.base` con `"strict": true`.
- `index.ts`: registra `App` como componente raíz (`registerRootComponent`).
- No se usan librerías de navegación, gestos, iconos ni UI de terceros: el swipe es `PanResponder` + `Animated`, y los íconos de la tab bar están dibujados con `View`, manteniendo el bundle liviano y 100 % compatible con Expo Go.

---

## 5. Flujo de desarrollo asistido por IA (OpenCode + DeepSeek V4.1 + Figma MCP)

El proyecto se construyó por micro-tareas atómicas, cada una validada con `npx tsc --noEmit` y cerrada con un commit de Conventional Commits. El agente **OpenCode**, impulsado por **DeepSeek V4.1**, trabajó con dos fuentes de verdad: el código real del repositorio y el archivo de Figma.

### 5.1 Figma como contrato visual

- **Archivo:** `uo8Zwg8EMhe8CWq1HBwRu2`
- **Nodos inspeccionados vía MCP de Figma:**
  - `35-6` — **Línea Gráfica**: identidad, paleta, tipografía, átomos, moléculas y wireframe.
  - `0-1` — **Prototipo**: pantalla real de candidatos (header, búsqueda, tarjetas, tab bar).

Toda consulta se hizo con el MCP de Figma; no se transcribieron estilos a mano. De ahí salieron los tokens reales del tema:

| Token | Valor extraído |
|---|---|
| Azul Marino (primario) | `#1E3A8A` |
| Verde Esmeralda (éxito/match) | `#10B981` |
| Blanco Puro (superficies) | `#FFFFFF` |
| Gris Perla (fondos/separadores) | `#F3F4F6` |
| Fondo de app | `#F9FAFB` |
| Bordes | `#E5E7EB` |
| Tinta principal | `#17243B` |
| Tinta secundaria | `#657185` |
| Verde oscuro (“Alto Match”) | `#047857` |
| Fondo badge de match | `#ECFDF5` |
| Tipografía | **Inter** · 400 / 500 / 600 / 700 |
| Escala | 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 30, 43, 61 px |
| Radios | 4, 6, 7, 8, 12, 20, 32, 100, 999 |
| Sombra de tarjeta | `0px 2px 8px rgba(17, 24, 39, 0.02)` |

Esos valores viven en `src/presentation/theme/` y los componentes solo consumen tokens; no hay colores ni medidas hardcodeadas en pantallas.

### 5.2 Secuencia de construcción

| Fase | Entregable | Commit aplicado (Conventional Commits) |
|---|---|---|
| 1 | Reglas del proyecto y estructura DDD/Atomic | `docs(agents): ...` · `chore(structure): ...` |
| 2 | Tokens de diseño desde Figma | `feat(theme): ...` |
| 3 | Bounded Context `auth` | `feat(auth): ...` |
| 4 | Bounded Context `psychometric` | `feat(psychometric): ...` |
| 5 | Bounded Contexts `discovery` y `hiring` | `feat(discovery,hiring): ...` |
| 6 | `AuthContext` | `feat(auth): ...` |
| 7 | Átomos, moléculas y organismos | `feat(ui): ...` |
| 8 | Pantallas por rol + `App.tsx` | `feat(ui): ...` |

Cada micro-tarea respetó una regla: **no avanzar a la capa visual sin dominio estable**, y no crear componentes fuera de la carpeta correspondiente. Eso mantuvo el historial de Git legible y reversible.

---

## 6. Funcionalidades principales y cuentas demo

### Rol Empresa (COMPANY)

1. **Explorar**: mazo con `SwipeDeckView`; gesto o botones para descartar (`LEFT`) o mostrar interés (`RIGHT`). Cada decisión se persiste vía `SwipeCandidateUseCase`.
2. **Matches**: lista de creadores aprobados con afinidad y riesgo; al abrir uno se consulta su reporte psicométrico (`BigFiveReportCard`) y se envía una propuesta de campaña.
3. **Perfil**: datos de la marca y cierre de sesión real (limpia AsyncStorage y vuelve a Welcome).

### Rol Creador (CREATOR)

1. **Sincronización**: analiza su @usuario con el motor Big Five y el perfil cultural de referencia.
2. **Reporte personal**: afinidad, nivel de riesgo (`LOW/MEDIUM/HIGH`), puntaje 0–100 y los cinco rasgos OCEAN.
3. **Cierre de sesión** funcional.

### Cuentas de prueba

Definidas en `src/modules/auth/infrastructure/mockAccounts.ts` y expuestas al Login mediante `AuthContext.demoCredentials`:

| Rol | Nombre | Correo | Contraseña | Usuario / Empresa | ID |
|---|---|---|---|---|---|
| COMPANY | Estudio Nova | `marca@talentvibe.com` | `marca1234` | Estudio Nova S.A.S. | `usr_company_demo` |
| CREATOR | Sofía Martínez | `creador@talentvibe.com` | `creador1234` | `@sofiamartinez` | `usr_creator_demo` |

La pantalla de Login incluye dos botones (**Rellenar marca** y **Rellenar creador**) que cargan estas credenciales sin escribirlas.

> Las contraseñas existen únicamente en la infraestructura mock. `domain/` no conoce credenciales en texto plano; en producción se reemplazaría `MockAuthRepository` por un adaptador real.

---

## 7. Guía de instalación y ejecución local

### Requisitos

- **Node.js** `^22.13.0` o `^24.3.0` (recomendado LTS 24) y **npm**. Son los rangos que declaran `expo@58` y `react-native@0.88` en sus `engines`.
- **Expo Go** instalado en el teléfono (App Store en iOS, Play Store en Android), versión compatible con **Expo SDK 58**.
- Teléfono y computadora en la **misma red Wi-Fi**.
- Sin necesidad de Android Studio, Xcode ni *custom dev client*.

### Paso a paso

```bash
# 1. Clonar el repositorio
git clone https://github.com/Crash0015/TalentVibe_Grupo3.git

# 2. Entrar al proyecto
cd TalentVibe_Grupo3

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor de desarrollo
npx expo start
```

### Abrir en el dispositivo

1. Ejecuta `npx expo start` y espera a que Metro muestre el **código QR** en la terminal.
2. **Android:** abre Expo Go → *Scan QR code* → apunta al QR. También puedes abrir Expo Go y elegir el proyecto desde *Recently in development*.
3. **iOS:** abre la app **Cámara** → apunta al QR → toca el aviso para abrir en Expo Go.
4. Si la app queda en blanco o no conecta, revisa los requisitos de red.

### Requisitos y solución de problemas de red

- Ambos dispositivos deben estar en la **misma red Wi-Fi** y sin *client isolation* / *AP isolation* (redes de invitados suelen bloquear la conexión).
- Permite a **Node/Metro** en el firewall de Windows/macOS (puerto **8081**).
- Si el QR no conecta por LAN, usa el modo túnel:

  ```bash
  npx expo start --tunnel
  ```

  Expo puede solicitar instalar el proveedor de túnel la primera vez; funciona incluso con redes distintas.
- Para forzar la IP de la máquina: `npx expo start --host lan`.

### Verificación de tipos

Antes de cada commit o Pull Request:

```bash
npx tsc --noEmit
```

El proyecto no tiene suite de tests ni ESLint configurado todavía; la verificación actual es el chequeo estricto de TypeScript y el bundle de Metro (`npx expo export --platform android`).

### Alcance del prototipo

- Los repositorios son **mocks**: la sesión y los usuarios registrados persisten en AsyncStorage; swipes, matches y propuestas viven en memoria durante la sesión.
- Los matches aprobados de `hiring` están sembrados con dos creadores de `psychometric`; los swipes a la derecha se registran en `discovery` pero aún no se insertan automáticamente en la lista de matches.
- El análisis de TikTok es simulado con perfiles predefinidos; no hay scraping ni integración con la API de TikTok.

---

---

## Documentación y recursos del proyecto

En los siguientes enlaces se encuentran los recursos de diseño, documentación técnica y código fuente correspondientes al proyecto TalentVibe.

| Recurso | Descripción |
|---|---|
| **Repositorio en GitHub** | Código fuente y estructura del proyecto. |
| **Diseño en Figma** | Línea gráfica y prototipo de la aplicación móvil. |
| **Informe del proyecto** | Documento académico con el desarrollo, fundamentos teóricos, análisis del dominio y lenguaje ubicuo, arquitectura y demás aspectos del proyecto. |

- **Repositorio:** [TalentVibe_Grupo3](https://github.com/Crash0015/TalentVibe_Grupo3)
- **Diseño en Figma:** [TalentVibe · Línea Gráfica y Prototipo](https://www.figma.com/design/uo8Zwg8EMhe8CWq1HBwRu2/TalentVibe?m=auto&t=m7U2prMdyCX2bBrd-6)
- **Informe del proyecto (Confluence):** [Consultar informe de TalentVibe](https://dispositivosmobilegrupo3.atlassian.net/wiki/external/MDYyZGZlODMwZjU1NGQ2MmIyMTA4YzA3ZjQ4YTZlZmU)
- **JIRA:** [TalentVibe_Grupo3 - Actividades](https://alex217.atlassian.net/jira/software/projects/STK/list?jql=project+%3D+STK+ORDER+BY+cf%5B10019%5D+ASC&atlOrigin=eyJpIjoiZGJkYzA2MzQ5YjU5NDFjNWEyODFkZTIxNmRhZTI5NjQiLCJwIjoiaiJ9) 

---

**Stack tecnológico:** Expo SDK 58 · React Native 0.88 · React 19 · TypeScript 6 · AsyncStorage · DDD + Atomic Design.
