import { TokenType } from "../../model/token.model";

export interface TokenDataInput {
  email: string;
  createdBy: string
  type: TokenType
  userId?: string;
  roleId?: string;
  organizationId?: string;
}
