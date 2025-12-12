import React, { useState, useEffect } from "react";
import { Indicador } from "../../types";
import { ProgressBar } from "./ProgressBar";

interface IndicadorCardProps {
  indicador: Indicador;
  onChange: (valor: number) => void;
}

export const IndicadorCard: React.FC<IndicadorCardProps> = ({
  indicador,
  onChange,
}) => {
  const [valorActual, setValorActual] = useState<number>(indicador.valor_logrado ?? 0);
  const [porcentaje, setPorcentaje] = useState<number>(0);

  useEffect(() => {
    calcularPorcentaje(valorActual);
  }, [valorActual]);

  const calcularPorcentaje = (valor: number) => {
    if (indicador.meta > 0) {
      const pct = Math.min(Math.round((valor / indicador.meta) * 100), 100);
      setPorcentaje(pct);
      onChange(valor);
    }
  };

  const totalBeneficiarios =
    (indicador.beneficiarios_directos ?? 0) +
    (indicador.beneficiarios_indirectos ?? 0);

  return (
    <div className="indicador-card" style={styles.card}>
      <h4 style={styles.titulo}>{indicador.nombre}</h4>

      <div style={styles.row}>
        <div>
          <label>Meta:</label>
          <div style={styles.valor}>
            {indicador.meta} {indicador.unidad_medida}
          </div>
        </div>

        <div>
          <label>Valor alcanzado:</label>
          <input
            type="number"
            value={valorActual}
            onChange={(e) => setValorActual(Number(e.target.value))}
            style={styles.input}
          />
        </div>
      </div>

      <ProgressBar percentage={porcentaje} label="Cumplimiento del indicador" />

      <p style={styles.beneficiarios}>
        Beneficiarios:{" "}
        <strong>
          {indicador.beneficiarios_directos ?? 0} directos /{" "}
          {indicador.beneficiarios_indirectos ?? 0} indirectos (Total: {totalBeneficiarios})
        </strong>
      </p>
    </div>
  );
};

const styles = {
  card: {
    background: "#142d52",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "15px",
  },
  titulo: {
    margin: 0,
    marginBottom: "5px",
    color: "#3fa65b",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },
  input: {
    width: "90px",
    padding: "5px",
    borderRadius: "5px",
  },
  valor: {
    marginTop: "3px",
    fontWeight: "bold",
  },
  beneficiarios: {
    marginTop: "10px",
    fontSize: "0.85rem",
  },
} as const;
