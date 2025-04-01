import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Zap } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const plans = [
    {
      name: 'Weekly',
      price: '$3.99',
      period: 'week',
      featured: false
    },
    {
      name: 'Monthly',
      price: '$7.99',
      period: 'month',
      featured: true
    },
    {
      name: 'Yearly',
      price: '$39.99',
      period: 'year',
      featured: false,
      savings: 'Save 17%'
    }
  ]

  const features = [
    'Unlimited recipe generations',
    'Save unlimited recipes',
    'Priority support',
    'Early access to new features'
  ]

  const handleSubscribe = (planName: string) => {
    setIsProcessing(true)
    setSelectedPlan(planName)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Successfully subscribed to ${planName} plan!`)
      navigate('/app')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0E1428] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-[#ECA72C] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0E1428] mb-2">Simple, transparent pricing</h2>
          <p className="text-[#6EA4BF]">All plans include the same great features. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-xl border ${plan.featured ? 'border-[#ECA72C] shadow-lg' : 'border-[#AFC2D5]'} overflow-hidden`}
            >
              {plan.featured && (
                <div className="bg-[#ECA72C] text-[#0E1428] text-center py-1 font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0E1428] mb-1">{plan.name}</h3>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className="text-4xl font-bold text-[#0E1428]">{plan.price}</span>
                  <span className="text-[#6EA4BF]">/{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="text-sm text-green-600 mb-4">{plan.savings}</div>
                )}
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${plan.featured ? 'bg-[#ECA72C] hover:bg-[#d89a26] text-[#0E1428]' : 'bg-[#0E1428] hover:bg-[#1a2542] text-white'} ${isProcessing && selectedPlan === plan.name ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing && selectedPlan === plan.name ? (
                    'Processing...'
                  ) : (
                    <>
                      <Zap size={18} /> Get Started
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#AFC2D5]">
          <h3 className="text-xl font-semibold text-[#0E1428] mb-4">All plans include:</h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-[#0E1428]">
                <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
