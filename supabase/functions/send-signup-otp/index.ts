import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSignupOTPRequest {
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const resendApiKey = Deno.env.get("RESEND_API_KEY") as string;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const resend = new Resend(resendApiKey);

  try {
    const { email }: SendSignupOTPRequest = await req.json();
    console.log('[send-signup-otp] Request received for email:', email);

    if (!email || typeof email !== 'string') {
      console.error('[send-signup-otp] Invalid email format');
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if email already exists
    console.log('[send-signup-otp] Checking if email exists...');
    const { data: existsData, error: existsError } = await supabase.rpc('email_exists', {
      email_input: email,
    });

    if (existsError) {
      console.error('[send-signup-otp] email_exists RPC error:', existsError);
      return new Response(JSON.stringify({ error: 'Failed to check email' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (existsData === true) {
      console.log('[send-signup-otp] Email already registered:', email);
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('[send-signup-otp] OTP generated for:', email);

    // Store OTP in table with purpose 'signup_verification'
    console.log('[send-signup-otp] Storing OTP in database...');
    const { error: insertError } = await supabase
      .from('password_reset_otps')
      .insert({ email, otp_code: otpCode, purpose: 'signup_verification' });

    if (insertError) {
      console.error('[send-signup-otp] Insert OTP error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to generate OTP' }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('[send-signup-otp] OTP stored successfully, sending email...');

    // Send OTP via email
    // IMPORTANT: For production, configure a custom domain in Resend dashboard
    // Using noreply@resend.dev has poor deliverability - set up your own domain!
    // Steps: 1) Add domain in Resend dashboard 2) Configure DNS records 3) Update 'from' field below
    try {
      const emailResult = await resend.emails.send({
        from: "PrivacyGuard <noreply@resend.dev>", // TODO: Replace with custom domain
        to: [email],
        subject: "Your PrivacyGuard sign-up verification code",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-family: Arial, sans-serif;">Verify Your Email</h1>
                          <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif;">
                            Thank you for signing up with PrivacyGuard! Use the verification code below to complete your registration.
                          </p>
                          <div style="background-color: #f8f9fa; border: 2px dashed #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333333; font-family: 'Courier New', monospace;">
                              ${otpCode}
                            </div>
                          </div>
                          <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 20px; font-family: Arial, sans-serif;">
                            This code will expire in <strong>10 minutes</strong>.
                          </p>
                          <p style="margin: 0; color: #999999; font-size: 13px; line-height: 18px; font-family: Arial, sans-serif;">
                            If you didn't request this code, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                          <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; font-family: Arial, sans-serif;">
                            © ${new Date().getFullYear()} PrivacyGuard. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });

      console.log('[send-signup-otp] Resend API response:', JSON.stringify(emailResult));

      if (emailResult.error) {
        console.error('[send-signup-otp] Resend returned error:', emailResult.error);
        // Delete the OTP since email failed
        await supabase
          .from('password_reset_otps')
          .delete()
          .eq('email', email)
          .eq('otp_code', otpCode);
        
        return new Response(JSON.stringify({ 
          error: 'Failed to send verification email. Please try again or contact support.' 
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log('[send-signup-otp] Email sent successfully to:', email);
    } catch (mailError: any) {
      console.error('[send-signup-otp] Resend exception:', mailError);
      console.error('[send-signup-otp] Error details:', {
        message: mailError.message,
        statusCode: mailError.statusCode,
        name: mailError.name
      });
      
      // Delete the OTP since email failed
      await supabase
        .from('password_reset_otps')
        .delete()
        .eq('email', email)
        .eq('otp_code', otpCode);

      return new Response(JSON.stringify({ 
        error: 'Email service temporarily unavailable. Please try again later.' 
      }), {
        status: 503,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('[send-signup-otp] Process completed successfully');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error('[send-signup-otp] Unexpected error:', error);
    console.error('[send-signup-otp] Error stack:', error.stack);
    return new Response(JSON.stringify({ error: 'Unexpected error occurred' }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});