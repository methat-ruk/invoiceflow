import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { Invoice } from '@/types'

Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/sarabun-400.ttf', fontWeight: 400 },
    { src: '/fonts/sarabun-700.ttf', fontWeight: 700 },
  ],
})

const s = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 10,
    color: '#1f2937',
    padding: 48,
  },
  // header
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  brandName: { fontSize: 20, fontWeight: 700, color: '#7c3aed' },
  brandSub: { fontSize: 9, color: '#6b7280', marginTop: 2 },
  invoiceLabel: { fontSize: 20, fontWeight: 700, textAlign: 'right', color: '#7c3aed' },
  invoiceNumber: { fontSize: 10, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  // meta row
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  metaBlock: { flexDirection: 'column', gap: 3 },
  metaLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2 },
  metaValue: { fontSize: 10, color: '#1f2937' },
  // items table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: 'right' },
  colPrice: { width: 80, textAlign: 'right' },
  colTotal: { width: 80, textAlign: 'right' },
  thText: { fontSize: 8, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' },
  tdText: { fontSize: 10, color: '#374151' },
  // totals
  totalsContainer: { alignItems: 'flex-end', marginTop: 12 },
  totalsBox: { width: 240 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  totalLabel: { fontSize: 10, color: '#6b7280' },
  totalValue: { fontSize: 10, color: '#1f2937' },
  divider: { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginVertical: 4 },
  grandLabel: { fontSize: 11, fontWeight: 700, color: '#1f2937' },
  grandValue: { fontSize: 11, fontWeight: 700, color: '#7c3aed' },
  // status badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 9, fontWeight: 700 },
  // notes
  notesLabel: { fontSize: 8, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 3, marginTop: 24 },
  notesText: { fontSize: 10, color: '#6b7280', lineHeight: 1.5 },
  // footer
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, textAlign: 'center', fontSize: 8, color: '#d1d5db' },
})

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  DRAFT:   { bg: '#f3f4f6', text: '#6b7280' },
  SENT:    { bg: '#e0f2fe', text: '#0369a1' },
  PAID:    { bg: '#dcfce7', text: '#15803d' },
  OVERDUE: { bg: '#fee2e2', text: '#dc2626' },
}

function fmt(n: number | string) {
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 })
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const badge = STATUS_COLORS[invoice.status] ?? STATUS_COLORS['DRAFT']

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>InvoiceFlow</Text>
            <Text style={s.brandSub}>Tax Invoice / ใบแจ้งหนี้</Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View style={[s.badge, { backgroundColor: badge.bg, marginTop: 6, alignSelf: 'flex-end' }]}>
              <Text style={[s.badgeText, { color: badge.text }]}>{invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* Meta */}
        <View style={s.metaRow}>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Bill To</Text>
            <Text style={s.metaValue}>{invoice.client.name}</Text>
            {invoice.project && (
              <Text style={[s.metaValue, { color: '#6b7280' }]}>
                Project: {invoice.project.name}
              </Text>
            )}
          </View>
          <View style={s.metaBlock}>
            <Text style={[s.metaLabel, { textAlign: 'right' }]}>Issue Date</Text>
            <Text style={[s.metaValue, { textAlign: 'right' }]}>{fmtDate(invoice.issueDate)}</Text>
            <Text style={[s.metaLabel, { textAlign: 'right', marginTop: 6 }]}>Due Date</Text>
            <Text style={[s.metaValue, { textAlign: 'right' }]}>{fmtDate(invoice.dueDate)}</Text>
          </View>
        </View>

        {/* Table header */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colDesc]}>Description</Text>
          <Text style={[s.thText, s.colQty]}>Qty</Text>
          <Text style={[s.thText, s.colPrice]}>Unit Price</Text>
          <Text style={[s.thText, s.colTotal]}>Total</Text>
        </View>

        {/* Table rows */}
        {invoice.items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tdText, s.colDesc]}>{item.description}</Text>
            <Text style={[s.tdText, s.colQty]}>{Number(item.quantity)}</Text>
            <Text style={[s.tdText, s.colPrice]}>฿{fmt(item.unitPrice)}</Text>
            <Text style={[s.tdText, s.colTotal]}>฿{fmt(item.total)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsContainer}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Subtotal</Text>
              <Text style={s.totalValue}>฿{fmt(invoice.subtotal)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>VAT ({Number(invoice.vatRate)}%)</Text>
              <Text style={s.totalValue}>฿{fmt(invoice.vatAmount)}</Text>
            </View>
            {Number(invoice.discount) > 0 && (
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Discount</Text>
                <Text style={s.totalValue}>-฿{fmt(invoice.discount)}</Text>
              </View>
            )}
            <View style={s.divider} />
            <View style={s.totalRow}>
              <Text style={s.grandLabel}>Total</Text>
              <Text style={s.grandValue}>฿{fmt(invoice.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View>
            <Text style={s.notesLabel}>Notes</Text>
            <Text style={s.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={s.footer}>
          Generated by InvoiceFlow · {invoice.invoiceNumber}
        </Text>
      </Page>
    </Document>
  )
}
