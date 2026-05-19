import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = searchParams.get('data');

    if (!data) {
      return NextResponse.json(
        { error: 'A data é um parâmetro obrigatório' },
        { status: 400 }
      );
    }

    try {
      // Buscar mesas ocupadas na data selecionada
      const sql = 'SELECT numero_mesa FROM reservas WHERE data_reserva = ? AND status != ?';
      const results = await query(sql, [data, 'cancelada']);
      
      const occupiedTables = results.map(row => row.numero_mesa);
      
      return NextResponse.json({
        success: true,
        occupiedTables
      });
    } catch (dbError) {
      console.warn('Erro ao carregar reservas do banco de dados, utilizando fallback de simulação:', dbError.message);
      
      // Fallback simulado: na simulação, algumas mesas aleatórias estarão ocupadas
      // (ex: mesas 2 e 5 ocupadas para fazer o mapa dinâmico)
      const fakeOccupied = [2, 5];
      
      return NextResponse.json({
        success: true,
        occupiedTables: fakeOccupied,
        isSimulated: true
      });
    }
  } catch (error) {
    console.error('Erro na consulta de reservas:', error);
    return NextResponse.json(
      { error: 'Falha interna do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { cliente_id, data_reserva, hora_reserva, numero_pessoas, numero_mesa, observacoes } = body;

    if (!cliente_id || !data_reserva || !hora_reserva || !numero_pessoas || !numero_mesa) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    try {
      // Inserir reserva no banco
      const sql = `
        INSERT INTO reservas (cliente_id, data_reserva, hora_reserva, numero_pessoas, numero_mesa, status, observacoes)
        VALUES (?, ?, ?, ?, ?, 'confirmada', ?)
      `;
      const result = await query(sql, [
        cliente_id,
        data_reserva,
        hora_reserva,
        numero_pessoas,
        numero_mesa,
        observacoes || ''
      ]);

      const insertId = result.insertId || Math.floor(Math.random() * 1000) + 1;
      console.log(`Reserva #${insertId} cadastrada com sucesso para o Cliente ID: ${cliente_id}`);

      return NextResponse.json({
        success: true,
        reservaId: insertId,
        message: 'Reserva confirmada com sucesso!'
      });
    } catch (dbError) {
      console.warn('Erro ao inserir reserva no banco, utilizando fallback de simulação:', dbError.message);
      
      // Fallback simulado
      const fakeReservaId = Math.floor(Math.random() * 9000) + 1000;
      return NextResponse.json({
        success: true,
        reservaId: fakeReservaId,
        isSimulated: true,
        message: 'Reserva simulada com sucesso!'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar reserva:', error);
    return NextResponse.json(
      { error: 'Falha interna do servidor' },
      { status: 500 }
    );
  }
}
