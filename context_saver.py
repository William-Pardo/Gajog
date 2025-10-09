#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Context Saver Script para Kilo Code
Guarda automáticamente el historial de conversaciones en contexto_global.md

Trigger: "guardarles"
Uso: Ejecutar este script con el comando "guardarles" para activar el guardado automático
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

class ContextSaver:
    def __init__(self):
        self.context_file = "contexto_global.md"
        self.trigger_command = "guardarles"

    def get_timestamp(self):
        """Obtiene la marca de tiempo actual en formato legible"""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def read_context_file(self):
        """Lee el contenido actual del archivo de contexto"""
        if not os.path.exists(self.context_file):
            # Crear archivo si no existe
            header = "# Contexto Global de Kilo Code\n\nEste archivo contiene resúmenes de conversaciones importantes para preservar contexto entre proyectos.\n\n\n"
            with open(self.context_file, 'w', encoding='utf-8') as f:
                f.write(header)
            return header

        with open(self.context_file, 'r', encoding='utf-8') as f:
            return f.read()

    def save_context_entry(self, resumen, detalles):
        """Guarda una nueva entrada en el archivo de contexto"""
        current_content = self.read_context_file()

        # Crear nueva entrada
        timestamp = self.get_timestamp()
        new_entry = f"## {timestamp}\n\n**Resumen:** {resumen}\n\n**Detalles:** {detalles}\n\n---\n\n"

        # Insertar la nueva entrada después del encabezado
        lines = current_content.split('\n')
        insert_index = -1
        for i, line in enumerate(lines):
            if line.startswith('## ') and not line.startswith('## Trigger'):
                insert_index = i
                break

        if insert_index == -1:
            # Si no encuentra entradas existentes, agregar al final
            updated_content = current_content.rstrip() + "\n\n" + new_entry
        else:
            # Insertar antes de la primera entrada existente
            updated_content = '\n'.join(lines[:insert_index]) + "\n\n" + new_entry + '\n'.join(lines[insert_index:])

        # Escribir el archivo actualizado
        with open(self.context_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f"✅ Contexto guardado exitosamente en {self.context_file}")

    def execute_trigger(self, resumen=None, detalles=None):
        """Ejecuta el trigger de guardado"""
        if resumen is None:
            resumen = input("Ingresa un resumen de la conversación: ").strip()

        if detalles is None:
            detalles = input("Ingresa los detalles de la conversación: ").strip()

        if not resumen:
            print("❌ Error: El resumen no puede estar vacío")
            return False

        self.save_context_entry(resumen, detalles)
        return True

def main():
    """Función principal del script"""
    saver = ContextSaver()

    # Verificar si se ejecutó con el trigger
    if len(sys.argv) > 1 and sys.argv[1] == saver.trigger_command:
        print("🔄 Activando guardado automático de contexto...")
        print("Trigger 'guardarles' detectado - Iniciando proceso de guardado")

        # Ejecutar el trigger
        success = saver.execute_trigger()
        if success:
            print("✅ Proceso completado exitosamente")
        else:
            print("❌ Error en el proceso de guardado")
            sys.exit(1)
    else:
        print("📝 Context Saver para Kilo Code")
        print("=" * 40)
        print(f"Trigger disponible: '{saver.trigger_command}'")
        print("\nUso:")
        print("1. Para usar el trigger automático:")
        print(f"   python context_saver.py {saver.trigger_command}")
        print("\n2. Para uso interactivo:")
        print("   python context_saver.py")
        print("\nEl archivo de contexto se guardará en: contexto_global.md")

        # Modo interactivo
        while True:
            print("\n" + "="*40)
            choice = input("¿Quieres guardar una entrada de contexto? (s/n): ").lower().strip()

            if choice == 's':
                saver.execute_trigger()
            elif choice == 'n':
                print("👋 ¡Hasta luego!")
                break
            else:
                print("❌ Opción no válida. Usa 's' para sí o 'n' para no.")

if __name__ == "__main__":
    # Información del trigger incluido en el archivo
    """
    ## Trigger "guardarles"

    ### Descripción
    El trigger "guardarles" es el comando utilizado para activar el guardado automático del historial de chat en este archivo de contexto global.

    ### Funcionamiento
    Cuando se ejecuta el comando "guardarles", el sistema:
    1. Lee el contenido actual del archivo contexto_global.md
    2. Agrega un nuevo resumen del chat actual, incluyendo la fecha y detalles relevantes
    3. Guarda los cambios en el archivo

    ### Uso en futuras ocasiones
    Este trigger puede ser utilizado en cualquier conversación futura para preservar el contexto importante, asegurando que la información relevante se mantenga disponible para referencias posteriores.
    """
    main()