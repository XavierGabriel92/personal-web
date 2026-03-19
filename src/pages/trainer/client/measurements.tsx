import MeasurementsList from "@/components/measurements/list";
import Measurement from "@/components/measurements/measure";
import { useState } from "react";

interface TrainerClientMeasurementsPageProps {
  clientId: string;
}

interface MeasurementItem {
  value: string;
  text: string;
}

const measurementsList: MeasurementItem[] = [
  // Body composition
  { value: "body-weight", text: "Peso Corporal" },
  { value: "body-fat", text: "Gordura Corporal" },
  // Upper body
  { value: "neck", text: "Pescoço" },
  { value: "shoulder", text: "Ombro" },
  { value: "chest", text: "Peito" },
  // Arms - left and right pairs
  { value: "left-bicep", text: "Bíceps Esquerdo" },
  { value: "right-bicep", text: "Bíceps Direito" },
  { value: "left-forearm", text: "Antebraço Esquerdo" },
  { value: "right-forearm", text: "Antebraço Direito" },
  // Core/Torso
  { value: "waist", text: "Cintura" },
  { value: "abdomen", text: "Abdômen" },
  { value: "hips", text: "Quadril" },
  // Legs - left and right pairs
  { value: "left-thigh", text: "Coxa Esquerda" },
  { value: "right-thigh", text: "Coxa Direita" },
  { value: "left-calf", text: "Panturrilha Esquerda" },
  { value: "right-calf", text: "Panturrilha Direita" },
]

export default function TrainerClientMeasurementsPage({ clientId: _clientId }: TrainerClientMeasurementsPageProps) {

  const [activeMeasurement, setActiveMeasurement] = useState<MeasurementItem>(measurementsList[0]);

  return <div className="flex flex-col md:flex-row gap-8">
    <MeasurementsList list={measurementsList} setActiveMeasurement={setActiveMeasurement} activeMeasurement={activeMeasurement} />
    <Measurement measurement={activeMeasurement} />
  </div>
}