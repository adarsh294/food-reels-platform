export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpHtml(otp) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OTP Verification</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb;padding:40px 15px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0"
style="background:#ffffff;border-radius:18px;overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.1);">

<!-- Header -->
<tr>
<td align="center"
style="padding:40px;
background:linear-gradient(135deg,#4F46E5,#7C3AED,#EC4899);">

<h1 style="margin:0;color:#ffffff;font-size:32px;">
🔐 OTP Verification
</h1>

<p style="margin-top:12px;color:#f3f3f3;font-size:16px;">
Secure Authentication Code
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#333333;">
Hello 👋
</h2>

<p style="font-size:16px;line-height:28px;color:#555555;">
We received a request to verify your account.
Please use the following One-Time Password (OTP) to continue.
</p>

<!-- OTP Box -->

<div
style="margin:35px auto;
width:260px;
background:linear-gradient(135deg,#6366F1,#8B5CF6);
padding:20px;
border-radius:14px;
text-align:center;
letter-spacing:10px;
font-size:38px;
font-weight:bold;
color:#ffffff;
box-shadow:0 8px 25px rgba(99,102,241,.4);">

${otp}

</div>

<p style="font-size:15px;color:#666;line-height:28px;">
This OTP is valid for
<strong>2 minutes</strong>.
Do not share this code with anyone.
Our team will never ask you for your OTP.
</p>

<!-- Warning Box -->

<div
style="background:#FFF7ED;
border-left:5px solid #F97316;
padding:18px;
margin-top:30px;
border-radius:8px;">

<p style="margin:0;color:#9A3412;font-size:14px;">
⚠️ If you didn't request this verification,
you can safely ignore this email.
</p>

</div>

</td>
</tr>

<!-- Footer -->

<tr>
<td align="center"
style="padding:30px;background:#F8FAFC;">

<p style="margin:0;font-size:14px;color:#666666;">
Need help?
Contact our support team anytime.
</p>

<p style="margin-top:10px;font-size:13px;color:#999999;">
© 2026 Your Company. All Rights Reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>

`;
}