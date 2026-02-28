import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xrkmbsrxbpkaeivojavo.supabase.co', 'sb_publishable_pWXmAsvJiBol8KKAeWXVvw_r9MU5jEo');

async function makeAdmin() {
    console.log("Setting user to admin...");
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: true, status: 'ACTIVE', subscription_tier: 'PRO_MONTHLY' })
        .eq('email', 'michaelmitry13@gmail.com')
        .select();
    console.log({ data, error });
}
makeAdmin();
