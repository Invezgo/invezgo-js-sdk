import { HttpClient } from '../client';

export interface AddMembershipDto {
  name: string;
  price: number;
  benefit: string[];
}

export class MembershipEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of memberships.
   */
  async list(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/membership');
  }

  /**
   * Add new membership.
   */
  async add(dto: AddMembershipDto): Promise<unknown> {
    return this.client.post<unknown>('/membership', dto);
  }

  /**
   * Get membership scopes.
   */
  async getScope(): Promise<unknown> {
    return this.client.get<unknown>('/membership/scope');
  }

  /**
   * Get membership transactions.
   */
  async getTransactions(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/membership/list');
  }

  /**
   * Update membership.
   */
  async update(id: string, dto: AddMembershipDto): Promise<unknown> {
    return this.client.put<unknown>(`/membership/${id}`, dto);
  }

  /**
   * Delete membership.
   */
  async delete(id: string): Promise<unknown> {
    return this.client.delete<unknown>(`/membership/${id}`);
  }
}
