
import { query } from '../src/db';
import { proyectosService } from '../src/services/proyectos.service';
import { gastosService } from '../src/services/gastos.service';

async function verifyFunctionality() {
    console.log('🧪 Starting Verification Script...');

    let proyectoId: number | null = null;
    let actividadId: number | null = null;
    const userId = 1;

    try {
        // 1. Setup: Create a Project
        console.log('\n--- Step 1: Creating Dummy Project ---');
        // Casting to any to avoid strict Partial<Proyecto> issues in test script
        const proyecto = await proyectosService.crearProyecto({
            anio: 2030,
            unidad_facultad: 'Test Verify',
            nombre: 'Proyecto Verificacion Auto',
            objetivo: 'Test',
            presupuesto_total: 1000
        } as any, userId);
        proyectoId = proyecto.id;
        console.log(`✅ Project Created: ID ${proyectoId}`);

        // 2. Setup: Create an Activity
        console.log('\n--- Step 2: Creating Activity ---');
        const actividad = await proyectosService.crearActividad(proyectoId!, {
            nombre: 'Actividad Test Inicial',
            descripcion: 'Desc',
            presupuesto_asignado: 500,
            meses: [1, 2]
        } as any);
        actividadId = actividad.id;
        console.log(`✅ Activity Created: ID ${actividadId} - Name: ${actividad.nombre}`);

        // 3. Verify: Add Expense
        console.log('\n--- Step 3: Verifying Expenses Reflection ---');
        await gastosService.crearGasto(actividadId!, {
            fecha_gasto: '2030-01-01',
            descripcion: 'Gasto Test 1',
            monto: 100
        } as any, userId);
        console.log('✅ Expense Added: $100');

        // Fetch Seguimiento
        const seguimiento = await proyectosService.getSeguimientoProyecto(proyectoId!);
        const actSeguimiento = seguimiento.actividades.find((a: any) => a.id_actividad === actividadId);

        // Note: total_gastado usually comes as string from Postgres SUM
        const totalGastado = Number(actSeguimiento?.total_gastado);
        console.log(`📊 Total Gastado reported by Backend: ${totalGastado}`);

        if (totalGastado === 100) {
            console.log('✅ SUCCESS: Total expenses reflect correctly!');
        } else {
            console.error(`❌ FAILURE: Expected 100, got ${totalGastado}`);
        }

        // 4. Verify: Update Activity
        console.log('\n--- Step 4: Verifying Update Activity ---');
        const nuevoNombre = 'Actividad Test MODIFICADA';
        await proyectosService.updateActividad(actividadId!, {
            nombre: nuevoNombre,
            presupuesto_asignado: 600,
            id_responsable: null
        } as any);

        const actUpdated = await proyectosService.getActividad(actividadId!);
        console.log(`📝 Updated Name: ${actUpdated.nombre}`);

        if (actUpdated.nombre === nuevoNombre && Number(actUpdated.presupuesto_asignado) === 600) {
            console.log('✅ SUCCESS: Activity updated correctly!');
        } else {
            console.error('❌ FAILURE: Update mismatch');
        }

        // 5. Verify: Delete Activity
        console.log('\n--- Step 5: Verifying Delete Activity ---');
        await proyectosService.deleteActividad(actividadId!);

        try {
            await proyectosService.getActividad(actividadId!);
            console.error('❌ FAILURE: Activity should have been deleted');
        } catch (e) {
            console.log('✅ SUCCESS: Activity deleted (404 Not Found as expected)');
        }

    } catch (error) {
        console.error('❌ FATAL ERROR in Verification:', error);
    } finally {
        if (proyectoId) {
            console.log('\n--- Cleanup: Deleting Dummy Project ---');
            await proyectosService.deleteProyecto(proyectoId!);
            console.log('✅ Cleanup Complete');
        }
    }
}

verifyFunctionality();
