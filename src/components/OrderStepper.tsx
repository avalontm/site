import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  PackageCheck, 
  Truck, 
  Home, 
  XCircle 
} from 'lucide-react';

const estadosOrden = [
  { 
    nombre: "Pendiente", 
    iconColor: "bg-yellow-500 text-white", 
    textColor: "text-yellow-600", 
    icon: Clock 
  },
  { 
    nombre: "Confirmada", 
    iconColor: "bg-green-500 text-white", 
    textColor: "text-green-600", 
    icon: CheckCircle 
  },
  { 
    nombre: "En proceso", 
    iconColor: "bg-blue-500 text-white", 
    textColor: "text-blue-600", 
    icon: PackageCheck 
  },
  { 
    nombre: "Enviada", 
    iconColor: "bg-purple-500 text-white", 
    textColor: "text-purple-600", 
    icon: Truck 
  },
  { 
    nombre: "Entregada", 
    iconColor: "bg-teal-500 text-white", 
    textColor: "text-teal-600", 
    icon: Home 
  },
  { 
    nombre: "Cancelada", 
    iconColor: "bg-red-500 text-white", 
    textColor: "text-red-600", 
    icon: XCircle 
  }
];

interface OrderStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ currentStep, onStepChange }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {estadosOrden.map((estado, index) => {
          const IconComponent = estado.icon;
          return (
            <div 
              key={index} 
              className="group flex cursor-pointer flex-col items-center"
              onClick={() => onStepChange(index)}
            >
              <div 
                className={`
                  flex size-12 items-center justify-center rounded-full transition-all duration-300
                  ${index <= currentStep 
                    ? estado.iconColor 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                <IconComponent />
              </div>
              <span 
                className={`
                  mt-2 text-sm font-medium
                  ${index === currentStep 
                    ? `font-bold ${estado.textColor}` 
                    : index < currentStep 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                  }
                `}
              >
                {estado.nombre}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Connecting line */}
      <div className="relative mt-2">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ 
              width: `${(currentStep / (estadosOrden.length - 1)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderStepper;