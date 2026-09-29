import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { getDatabase, getIndustryDatabase } from '../db/mongodb.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mistry-gems-local-secret-key-12345'

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]))
}

function userFromRequest(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return null
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    const accountType =
      payload.accountType === 'industry' ||
      String(payload.role || '').toLowerCase().includes('industry')
        ? 'industry'
        : 'workshop'
    return typeof payload.id === 'string'
      ? { id: payload.id, accountType, companyId: String(payload.companyId || payload.id), name: String(payload.name || ''), email: String(payload.email || '') }
      : null
  } catch { return null }
}

// Send email notification using nodemailer (Ethereal fallback if no SMTP configured)
async function sendQuotationEmail({ toEmail, toName, workshopName, jobTitle, amount, requirementId, quotationId }) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.info('Quotation email skipped: SMTP is not configured.')
      return false
    }
    let transporter

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount || 0)

    const info = await transporter.sendMail({
      from: `"Mistry Gems Platform" <noreply@mistrygems.app>`,
      to: toEmail,
      subject: `📋 New Quotation Received for "${jobTitle}" — Mistry Gems`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;">
          <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#03045E,#0077B6);padding:28px 32px;">
              <p style="margin:0;color:#90E0EF;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Mistry Gems Platform</p>
              <h1 style="margin:8px 0 0;color:#CAF0F8;font-size:22px;">New Quotation Received</h1>
            </div>
            <!-- Body -->
            <div style="padding:28px 32px;">
              <p style="margin:0 0 18px;color:#374151;font-size:14px;">Hi <strong>${escapeHtml(toName)}</strong>,</p>
              <p style="margin:0 0 20px;color:#4B5563;font-size:14px;line-height:1.6;">
                A workshop has submitted a quotation for your requirement. Review and compare it in your Industry Portal.
              </p>
              <!-- Info Box -->
              <div style="background:#F0F2F5;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#6B7280;font-size:12px;width:40%;">Requirement</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(jobTitle)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6B7280;font-size:12px;">Submitted By</td>
                    <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(workshopName)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6B7280;font-size:12px;">Quoted Amount</td>
                    <td style="padding:6px 0;color:#0077B6;font-size:15px;font-weight:700;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6B7280;font-size:12px;">Quotation ID</td>
                    <td style="padding:6px 0;color:#9CA3AF;font-size:11px;font-family:monospace;">${escapeHtml(quotationId)}</td>
                  </tr>
                </table>
              </div>
              <!-- CTA Button -->
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.APP_URL || 'https://mistrygems.vercel.app'}/industry/quotations"
                   style="display:inline-block;background:linear-gradient(135deg,#0077B6,#00B4D8);color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
                  View Quotation →
                </a>
              </div>
              <p style="margin:0;color:#9CA3AF;font-size:11px;text-align:center;">
                You are receiving this because you posted Requirement #${requirementId} on Mistry Gems.
              </p>
            </div>
            <!-- Footer -->
            <div style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:16px 32px;text-align:center;">
              <p style="margin:0;color:#9CA3AF;font-size:11px;">
                © ${new Date().getFullYear()} Mistry Gems · Agni College of Technology, Chennai 600 130<br>
                Built with ❤️ by Team Mistry Gems
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // In dev, log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log('📧 [Dev] Email preview:', nodemailer.getTestMessageUrl(info))
    }
    return true
  } catch (err) {
    console.error('Email send failed (non-fatal):', err.message)
    return false
  }
}

export default async function handler(req, res) {
  const user = userFromRequest(req)
  if (!user) return res.status(403).json({ error: 'Authorization required.' })

  const industryDb = await getIndustryDatabase()
  const workshopDb = await getDatabase()
  const quotations = industryDb.collection('quotations')
  const requirements = industryDb.collection('requirements')

  // ── GET: Industry user fetches all quotations for their requirements ──
  if (req.method === 'GET') {
    const filter = user.accountType === 'industry'
      ? { industryCompanyId: user.companyId }
      : { workshopId: user.id }
    const list = await quotations
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()
    return res.status(200).json(list.map(({ _id, ...q }) => q))
  }

  // ── POST: Workshop submits quotation for a requirement ──
  if (req.method === 'POST') {
    if (user.accountType !== 'workshop') {
      return res.status(403).json({ error: 'Workshop account required to submit quotations.' })
    }

    const { requirementId, description, quantity, unitCost, gstRate, deliveryDays, notes } = req.body || {}

    const parsedQuantity = Number(quantity)
    const parsedUnitCost = Number(unitCost)
    const parsedDeliveryDays = deliveryDays === '' || deliveryDays == null ? null : Number(deliveryDays)
    const parsedGstRate = gstRate == null || gstRate === '' ? 18 : Number(gstRate)

    if (!requirementId || !String(description).trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !Number.isFinite(parsedUnitCost) || parsedUnitCost <= 0) {
      return res.status(400).json({ error: 'requirementId, description, quantity and unitCost are required.' })
    }
    if (!Number.isFinite(parsedGstRate) || parsedGstRate < 0 || parsedGstRate > 100 || (parsedDeliveryDays !== null && (!Number.isInteger(parsedDeliveryDays) || parsedDeliveryDays < 1))) {
      return res.status(400).json({ error: 'GST rate or delivery days are invalid.' })
    }

    // Fetch the requirement to get industry company details
    const requirement = await requirements.findOne({ id: requirementId })
    if (!requirement) return res.status(404).json({ error: 'Requirement not found.' })
    if (requirement.status === 'Closed') return res.status(400).json({ error: 'This requirement is no longer accepting quotations.' })

    const gst = parsedGstRate
    const subtotal = parsedQuantity * parsedUnitCost
    const gstAmount = (subtotal * gst) / 100
    const grandTotal = subtotal + gstAmount

    const quotation = {
      id: `QUO-${Date.now()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      requirementId,
      requirementTitle: requirement.jobTitle,
      industryCompanyId: requirement.companyId,
      industryCompanyName: requirement.companyName || 'Industry Account',
      workshopId: user.id,
      workshopName: user.name,
      description: String(description).trim(),
      quantity: parsedQuantity,
      unitCost: parsedUnitCost,
      gstRate: gst,
      gstAmount,
      subtotal,
      grandTotal,
      deliveryDays: parsedDeliveryDays,
      notes: typeof notes === 'string' ? notes.trim() : '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }

    await quotations.insertOne(quotation)

    // Increment quotationsReceived on the requirement
    await requirements.updateOne({ id: requirementId }, { $inc: { quotationsReceived: 1 } })

    // Fetch industry user's email for notification
    const users = workshopDb.collection('users')
    const industryUser = await users.findOne({ companyId: requirement.companyId })
      || await users.findOne({ id: requirement.companyId })
    const toEmail = industryUser?.email || requirement.industryEmail
    const toName = industryUser?.name || requirement.companyName || 'Industry Account'

    const emailSent = toEmail ? await sendQuotationEmail({
        toEmail,
        toName,
        workshopName: user.name,
        jobTitle: requirement.jobTitle,
        amount: grandTotal,
        requirementId,
        quotationId: quotation.id,
      }) : false

    const { _id, ...safeQuotation } = quotation
    return res.status(201).json({ ...safeQuotation, emailSent })
  }

  // ── PUT: Industry user updates quotation status (Accept/Reject) ──
  if (req.method === 'PUT') {
    if (user.accountType !== 'industry') return res.status(403).json({ error: 'Industry account required.' })
    const { id, status } = req.body || {}
    if (!id || !['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Quotation id and valid status required.' })
    }
    const existing = await quotations.findOne({ id, industryCompanyId: user.companyId })
    if (!existing) return res.status(404).json({ error: 'Quotation not found.' })
    if (existing.status === status) {
      const { _id, ...safeExisting } = existing
      return res.status(200).json(safeExisting)
    }
    const result = await quotations.findOneAndUpdate(
      { id, industryCompanyId: user.companyId },
      { $set: { status } },
      { returnDocument: 'after' }
    )
    const doc = result?.value ?? result
    if (!doc) return res.status(404).json({ error: 'Quotation not found.' })

    const users = workshopDb.collection('users')
    const notification = {
      id: `NOT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      title: `Quotation ${status}`,
      message: `${existing.industryCompanyName} ${status.toLowerCase()} your quotation for ${existing.requirementTitle}.`,
      type: status === 'Accepted' ? 'success' : 'warning', time: new Date().toISOString(), read: false,
      group: 'Today', channel: 'in-app', quotationId: existing.id,
      ownerId: existing.workshopId, createdAt: new Date().toISOString(),
    }
    await workshopDb.collection('notifications').insertOne(notification)
    if (status === 'Accepted') {
      const customer = {
        id: `CUST-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        name: existing.industryCompanyName || 'Industry Customer', company: existing.industryCompanyName || 'Industry Customer',
        email: '', phone: '', city: '', totalJobs: 0, totalRevenue: 0,
        status: 'Active', avatar: (existing.industryCompanyName || 'IC').slice(0, 2).toUpperCase(),
        ownerId: existing.workshopId, createdAt: new Date().toISOString(), industryCompanyId: existing.industryCompanyId,
      }
      await workshopDb.collection('customers').updateOne(
        { ownerId: existing.workshopId, industryCompanyId: existing.industryCompanyId },
        { $setOnInsert: customer, $inc: { totalJobs: 1, totalRevenue: existing.grandTotal } }, { upsert: true },
      )
    }
    const { _id, ...safeDoc } = doc
    return res.status(200).json(safeDoc)
  }

  res.setHeader('Allow', 'GET, POST, PUT')
  return res.status(405).json({ error: 'Method not allowed.' })
}
