export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      beanigotchi: {
        Row: {
          createdAt: string;
          fid: number;
          lastFeedTime: number;
          lastTrainTime: number;
          lastWaterTime: number;
          preferredBeanId: number | null;
          xp: number;
        };
        Insert: {
          createdAt?: string;
          fid: number;
          lastFeedTime?: number;
          lastTrainTime?: number;
          lastWaterTime?: number;
          preferredBeanId?: number | null;
          xp?: number;
        };
        Update: {
          createdAt?: string;
          fid?: number;
          lastFeedTime?: number;
          lastTrainTime?: number;
          lastWaterTime?: number;
          preferredBeanId?: number | null;
          xp?: number;
        };
        Relationships: [];
      };
      "beans-riddles": {
        Row: {
          answer: string;
          created_at: string;
          id: number;
          riddle: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          id?: number;
          riddle: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: number;
          riddle?: string;
        };
        Relationships: [];
      };
      "degen-price-winners": {
        Row: {
          amount: number;
          created_at: string;
          fid: number;
          id: number;
          username: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          fid: number;
          id?: number;
          username: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          fid?: number;
          id?: number;
          username?: string;
        };
        Relationships: [];
      };
      "erc-20-transactions": {
        Row: {
          created_at: string;
          isApproval: boolean;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          isApproval: boolean;
          uuid: string;
        };
        Update: {
          created_at?: string;
          isApproval?: boolean;
          uuid?: string;
        };
        Relationships: [];
      };
      test_todo: {
        Row: {
          created_at: string;
          done: boolean;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          done?: boolean;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          done?: boolean;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
