import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabase/serverComponentSupabase";
import { Database } from "@/supabase/codegen/types";

export default async function Page() {
    const { data } = await supabase.from("auction-config").select();

    // Server Action
    async function create(formData: FormData) {
        "use server";

        const resp = await supabase.from("auction-config").insert({
            auction_address: formData.get("auctionAddress")?.toString() ?? "",
            auction_url: "MY ADDR",
            background_color: "MY ADDR",
            dao_type: "nounsBuilder",
            description: "DESC",
            first_page_image: "FP",
            font_type: "inter",
            text_color: "RED",
            title: "T",
            token_address: "AS",
            token_name_prefix: "AS",
        });
        console.log(resp);
    }

    return (
        <form action={create} className="flex flex-col">
            <Label>
                Auction Address:
                <Input name="auctionAddress" />
            </Label>
            <button type="submit">Search</button>
        </form>
    );
}
