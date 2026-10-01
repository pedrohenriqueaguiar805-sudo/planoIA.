import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { BillingCycle, SubscriptionTier, SubscriptionTierId } from '../types';

interface CheckoutModalProps {
  tier: SubscriptionTier | null;
  billingCycle: BillingCycle;
  onClose: () => void;
  onConfirmSubscription: (tierId: SubscriptionTierId, cycle: BillingCycle) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  tier,
  billingCycle: initialCycle,
  onClose,
  onConfirmSubscription,
}) => {
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [customerName, setCustomerName] = useState('Pedro Henrique Aguiar');
  const [customerEmail, setCustomerEmail] = useState('pedro@planoia.com.br');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!tier) return null;

  const baseMonthly = cycle === 'annual' ? tier.annualMonthlyPrice : tier.monthlyPrice;
  const discountMultiplier = couponApplied ? 0.9 : 1;
  const finalMonthly = Math.round(baseMonthly * discountMultiplier);
  const totalCharge = cycle === 'annual' ? finalMonthly * 12 : finalMonthly;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FUNDADOR10' || coupon.trim().length >= 4) {
      setCouponApplied(true);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmSubscription(tier.id, cycle);
      }, 900);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#141417] border border-stone-200 dark:border-zinc-800 shadow-editorial-lg overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800 bg-alabaster dark:bg-[#18181C]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-display font-bold text-sm">
              P.
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
                Checkout Seguro • Assinatura Recorrente
              </span>
              <h3 className="text-base font-display font-bold text-charcoal dark:text-white">
                Plano {tier.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stoneMuted hover:text-charcoal dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-2xl font-display font-bold text-charcoal dark:text-white">
              Assinatura {tier.name} Ativada!
            </h4>
            <p className="text-sm text-slateInk dark:text-zinc-400 max-w-md mx-auto">
              Seu workspace foi atualizado com todos os limites da camada{' '}
              <strong className="text-charcoal dark:text-white">{tier.name}</strong> ({tier.limits.maxBrands}{' '}
              {tier.limits.maxBrands === 1 ? 'marca' : 'marcas'} e até {tier.limits.maxPostsPerMonth} pautas/mês).
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-mono text-brand-600 dark:text-brand-400">
                Redirecionando para o seu Studio...
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleComplete} className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Column: Form */}
            <div className="md:col-span-7 p-6 space-y-5 border-b md:border-b-0 md:border-r border-stone-200 dark:border-zinc-800">
              {/* Billing Cycle Switch */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-2">
                  Ciclo de Faturamento
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCycle('annual')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cycle === 'annual'
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/30 ring-1 ring-brand-600'
                        : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-charcoal dark:text-white">Anual</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                        -20% OFF
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-charcoal dark:text-white">
                      R$ {tier.annualMonthlyPrice}/mês
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCycle('monthly')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      cycle === 'monthly'
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/30 ring-1 ring-brand-600'
                        : 'border-stone-200 dark:border-zinc-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-charcoal dark:text-white">Mensal</span>
                      <span className="text-[10px] font-mono text-stoneMuted">Flexível</span>
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-charcoal dark:text-white">
                      R$ {tier.monthlyPrice}/mês
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                    Nome ou Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slateInk dark:text-zinc-400 mb-1">
                    E-mail de Acesso ao Workspace
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slateInk dark:text-zinc-400 mb-2">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    PIX Automático
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      paymentMethod === 'card'
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-stone-200 dark:border-zinc-800 text-slateInk dark:text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="mt-3 p-3 rounded-lg bg-alabaster dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 space-y-2.5">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 4242"
                      defaultValue="4532 •••• •••• 8891"
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-charcoal dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        defaultValue="08/29"
                        className="px-2.5 py-1.5 text-xs font-mono rounded border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-charcoal dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        defaultValue="842"
                        className="px-2.5 py-1.5 text-xs font-mono rounded border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-charcoal dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3">
                    <QrCode className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs text-slateInk dark:text-zinc-300 leading-relaxed">
                      Liberação instantânea do plano <strong>{tier.name}</strong> após confirmação (ambiente de demonstração: ativação em 1 clique).
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="md:col-span-5 p-6 bg-alabaster dark:bg-[#18181C] flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stoneMuted">
                    Resumo da Camada
                  </span>
                  <h4 className="text-lg font-display font-bold text-charcoal dark:text-white mt-0.5">
                    {tier.name}
                  </h4>
                  <p className="text-xs text-slateInk dark:text-zinc-400 mt-1">{tier.tagline}</p>
                </div>

                <ul className="space-y-2 border-t border-b border-stone-200 dark:border-zinc-800 py-3">
                  <li className="flex items-center gap-2 text-xs text-charcoal dark:text-zinc-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Até {tier.limits.maxBrands} {tier.limits.maxBrands === 1 ? 'DNA de Marca' : 'DNAs de Marca / Clientes'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-charcoal dark:text-zinc-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{tier.limits.maxPostsPerMonth} pautas e copies por mês</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-charcoal dark:text-zinc-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Reescritas IA: {tier.limits.copyLabRewrites}</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-charcoal dark:text-zinc-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{tier.limits.teamSeats} {tier.limits.teamSeats === 1 ? 'assento' : 'assentos de equipe'}</span>
                  </li>
                </ul>

                {/* Coupon */}
                <div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Cupom (ex: FUNDADOR10)"
                      className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-charcoal dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-200/80 dark:bg-zinc-800 text-charcoal dark:text-zinc-200 hover:bg-stone-300 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Desconto adicional de 10% aplicado!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-slateInk dark:text-zinc-400">
                    <span> Equivalente mensal</span>
                    <span className="font-mono font-semibold text-charcoal dark:text-white">
                      R$ {finalMonthly},00/mês
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-charcoal dark:text-white pt-2 border-t border-stone-200 dark:border-zinc-800">
                    <span>Total hoje ({cycle === 'annual' ? 'Anual' : 'Mensal'})</span>
                    <span className="font-mono text-base text-brand-600 dark:text-brand-400">
                      R$ {totalCharge},00
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>Ativando assinatura...</span>
                  ) : (
                    <>
                      <span>Ativar Plano {tier.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-stoneMuted">
                  <Lock className="w-3 h-3" />
                  <span>Garantia incondicional de 7 dias • Cancele quando quiser</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
