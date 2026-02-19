import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
    const pricingPlans = [
        {
            name: 'Single Class',
            price: 20,
            features: [
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
            ],
        },
        {
            name: '5 Class Package',
            price: 95,
            pricePerClass: '($19/Class)',
            features: [
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
            ],
        },
        {
            name: '10 Class Package',
            price: 180,
            pricePerClass: '($18/Class)',
            badge: 'Best Value',
            features: [
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
                'Lorem ipsum dolor sit amet',
            ],
        },
    ];
    return (
        <div className="mt-40 py-20 bg-[#EEFEE4]">
            <div className="max-w-7xl mx-auto px-5">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Our Offerings
                    </h2>
                    <p className="text-gray-600">
                        Flexible pricing to fit your learning goals
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative ${plan.badge
                                ? 'border-gray-200'
                                : index === 1
                                    ? 'border-primary'
                                    : ''
                                }`}

                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}
                            <CardContent>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-[#7AB839]">${plan.price}</span>
                                    {plan.pricePerClass && (
                                        <span className="text-gray-600 ml-2">{plan.pricePerClass}</span>
                                    )}
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start space-x-2">
                                            <CheckCircle2 className="w-5 h-5 text-[#7AB839] shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full">
                                    Choose Package
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;