import { AuthError } from './AuthError';
import { Email } from './Email';

/**
 * Roles de negocio de TalentVibe.
 * - COMPANY: marca que evalúa y contrata creadores.
 * - CREATOR: creador de TikTok evaluado por su perfil Big Five.
 */
export type UserRole = 'COMPANY' | 'CREATOR';

export const USER_ROLES: readonly UserRole[] = ['COMPANY', 'CREATOR'];

/** Representación serializable de la entidad (para persistencia y mocks). */
export interface UserPrimitives {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  handleOrCompany: string;
}

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  role: UserRole;
  handleOrCompany: string;
}

/**
 * Entidad User del Bounded Context `auth`.
 *
 * `handleOrCompany` guarda el @usuario de TikTok cuando el rol es CREATOR
 * o el nombre comercial cuando el rol es COMPANY.
 */
export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    const id = props.id.trim();
    const name = props.name.trim();
    const handleOrCompany = props.handleOrCompany.trim();

    if (!id) {
      throw new AuthError('INVALID_USER', 'El identificador del usuario es obligatorio.');
    }

    if (!name) {
      throw new AuthError('INVALID_USER', 'El nombre del usuario es obligatorio.');
    }

    if (!handleOrCompany) {
      throw new AuthError(
        'INVALID_USER',
        'El usuario de TikTok o nombre de la empresa es obligatorio.',
      );
    }

    return new User({ ...props, id, name, handleOrCompany });
  }

  static fromPrimitives(primitives: UserPrimitives): User {
    return User.create({
      id: primitives.id,
      name: primitives.name,
      email: Email.create(primitives.email),
      role: primitives.role,
      handleOrCompany: primitives.handleOrCompany,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get emailAddress(): string {
    return this.props.email.value;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get handleOrCompany(): string {
    return this.props.handleOrCompany;
  }

  isCompany(): boolean {
    return this.props.role === 'COMPANY';
  }

  isCreator(): boolean {
    return this.props.role === 'CREATOR';
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email.value,
      role: this.props.role,
      handleOrCompany: this.props.handleOrCompany,
    };
  }
}
