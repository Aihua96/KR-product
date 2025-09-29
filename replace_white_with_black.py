from PIL import Image

img_path = 'public/proxmox-logo.png'
output_path = 'public/proxmox-logo-black.png'

img = Image.open(img_path).convert('RGBA')
pixels = img.load()

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        # 判断是否为白色（可适当调整阈值）
        if r > 200 and g > 200 and b > 200 and a > 0:
            pixels[x, y] = (0, 0, 0, a)

img.save(output_path)
print('处理完成，已生成：', output_path)