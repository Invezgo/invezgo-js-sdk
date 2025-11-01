import { HttpClient } from '../client';

export interface AddMembershipDto {
  membershipId: string;
  // Add other required fields based on API
}

export class MembershipEndpoints {
  constructor(private client: HttpClient) {}

  /**
   * Get list of memberships
   */
  async list(): Promise<any[]> {
    return this.client.get<any[]>('/membership');
  }

  /**
   * Add new membership
   */
  async add(dto: AddMembershipDto): Promise<any> {
    return this.client.post<any>('/membership', dto);
  }

  /**
   * Get membership scope
   */
  async getScope(): Promise<any> {
    return this.client.get<any>('/membership/scope');
  }

  /**
   * Get membership transactions
   */
  async getTransactions(): Promise<any[]> {
    return this.client.get<any[]>('/membership/list');
  }

  /**
   * Update membership
   */
  async update(id: string, dto: AddMembershipDto): Promise<any> {
    return this.client.put<any>(`/membership/${id}`, dto);
  }

  /**
   * Delete membership
   */
  async delete(id: string): Promise<any> {
    return this.client.delete<any>(`/membership/${id}`);
  }
}

