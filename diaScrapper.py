import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

base_url = "https://www.dia.es/x/x/c/"
start_range = 2001
end_range = 2226

noDisponibles = 0
productos = []

for i in range(start_range, end_range):
    url = f"{base_url}L{i:04}"
    print(f"Scrapeando: {url}")
    
    driver.get(url)

    try:
        categoria = WebDriverWait(driver, 0.5).until(
            EC.presence_of_element_located((By.TAG_NAME, 'h1'))
        ).text
        print(f"Categoría: {categoria}")
    except Exception as e:
        #print("No se pudo encontrar la categoría:", e)
        continue  # Saltar a la siguiente categoría si falla

    # Hacer scroll hasta el final de la página
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Esperar a que carguen más productos
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Encontrar los productos en la página
    try:
        # Cambia a buscar los productos con un selector más específico
        productos_ini = driver.find_elements(By.CLASS_NAME, 'product-card-list__item-container')
        print(f"Productos encontrados: {len(productos_ini)}")

        # Extrae el HTML de cada producto y guárdalo en una lista
        productos_html = [producto.get_attribute('outerHTML') for producto in productos_ini]

        for producto in productos_html:
            try:
                # Suponiendo que productos_html contiene el HTML del producto
                soup = BeautifulSoup(producto, 'html.parser')

                # Encontrar el enlace del producto
                enlace_elemento = soup.find('a')
                enlace = enlace_elemento['href'] if enlace_elemento else None

                if not enlace:
                    print("No se encontró el enlace del producto")
                    continue

                driver.get(enlace)
                time.sleep(1)

                # Extraer el nombre del producto
                try:
                    nombre = WebDriverWait(driver, 0.5).until(
                        EC.presence_of_element_located((By.TAG_NAME, 'h1'))
                    ).text
                except:
                    nombre = 'No disponible'

                # Extraer el precio activo
                try:
                    precio_unitario = driver.find_element(By.CLASS_NAME, 'buy-box__active-price').text
                except:
                    precio_unitario = 'No disponible'

                # Extraer el precio por unidad (litro/kilo)
                try:
                    precio_por_unidad = driver.find_element(By.CLASS_NAME, 'buy-box__price-per-unit').text
                except:
                    precio_por_unidad = 'No disponible'

                # Extraer la imagen
                try:
                    imagen = driver.find_element(By.CLASS_NAME, 'product-image').get_attribute('src')
                except:
                    imagen = 'No disponible'


                if nombre == 'No disponible' or precio_unitario == 'No disponible' or precio_por_unidad == 'No disponible' or imagen == 'No disponible':
                    print("Producto no disponible")
                    noDisponibles += 1
                    continue
                
                productos.append({
                    'categoria': categoria,
                    'nombre': nombre,
                    'precio_unitario': precio_unitario,
                    'precio_por_unidad': precio_por_unidad,
                    'imagen': "https://www.dia.es" + imagen
                })

            except Exception as e:
                print("Error al extraer datos del producto:", e)

    except Exception as e:
        #print("No se encontraron productos:", e)
        continue

# Cerrar el driver
driver.quit()

# Guardar los datos en un archivo JSON
with open('productos_dia.json', 'w', encoding='utf-8') as json_file:
    json.dump(productos, json_file, ensure_ascii=False, indent=4)

print("Scraping completado y datos guardados en productos_dia.json.")
print("No disponibles:", noDisponibles)