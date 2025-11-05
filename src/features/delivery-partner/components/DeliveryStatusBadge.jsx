import { Clock, Truck, PackageCheck, CheckCircle } from "lucide-react";

const DeliveryStatusBadge = ({ status, size = "md" }) => {
  const statusConfig = {
    pending: {
      label: "Pending Pickup",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    shipped: {
      label: "Shipped",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Truck,
    },
    outForDelivery: {
      label: "Out for Delivery",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: PackageCheck,
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

export default DeliveryStatusBadge;
