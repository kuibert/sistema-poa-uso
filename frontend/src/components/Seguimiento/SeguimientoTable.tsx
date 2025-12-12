import React from "react";
import { Actividad, MesSeguimiento } from "../../types";
import { poaApi } from "../../services/poaApi";


interface SeguimientoTableProps {
  actividades: Actividad[];
  onUpdate: () => void;
}

export const SeguimientoTable: React.FC<SeguimientoTableProps> = ({
  actividades,
  onUpdate,
}) => {
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  const handleEstadoChange = async (
    actividadId: number,
    mes: number,
    estado: string
  ) => {
    try {
      const seguimiento: MesSeguimiento[] = [
        { mes, estado: estado as any, comentario: "" },
      ];

      await poaApi.updateSeguimientoMensual(actividadId, seguimiento);
      onUpdate();
    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);
    }
  };

  const getEstado = (actividad: Actividad, mes: number) => {
    const seg = actividad.seguimiento_mensual?.find(s => s.mes === mes);
    return seg?.estado || "-";
  };

  return (
    <table className="seguimiento-table">
      <thead>
        <tr>
          <th>Actividad</th>
          {meses.map((m, i) => (
            <th key={i}>{m}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {actividades.map(act => (
          <tr key={act.id_actividad}>
            <td>{act.nombre}</td>

            {meses.map((_, idx) => (
              <td key={idx}>
                <select
                  value={getEstado(act, idx + 1)}
                  onChange={e =>
                    handleEstadoChange(act.id_actividad, idx + 1, e.target.value)
                  }
                >
                  <option value="-">-</option>
                  <option value="P">P</option>
                  <option value="I">I</option>
                  <option value="F">F</option>
                </select>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
