package com.rta.java.adapter;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Date;

import javax.imageio.ImageIO;

import net.coobird.thumbnailator.Thumbnails;

import org.apache.commons.lang.math.RandomUtils;
import org.apache.geronimo.mail.util.Base64;

public class ImageMerge {
	
	public static String resizeImageSize(String base64Image, long limitSize) {
		try {
			byte[] decode = Base64.decode(base64Image);

			BufferedImage bufImg = ImageIO
					.read(new ByteArrayInputStream(decode));

			File tempFile = new File("temp.png");
			ImageIO.write(bufImg, "png", tempFile);

			long length = tempFile.length();

			if (length > limitSize) {

				return resizeImageSize(tempFile, limitSize);

			}

			tempFile.delete();

		} catch (Exception e) {
			e.printStackTrace();
		}
		return base64Image;
	}

	public static String resizeImageSize(File file, long limitSize)
			throws Exception {
		File resizeFile = new File(new Date().getTime()
				+ RandomUtils.nextInt(3) + ".png");
		Thumbnails.of(file).scale(0.5).toFile(resizeFile);

		if (resizeFile.length() > limitSize) {
			return resizeImageSize(resizeFile, limitSize);
		}

		if (resizeFile.exists()) {
			resizeFile.delete();
		}
		
		BufferedImage asBufferedImage = Thumbnails.of(file).scale(0.5).asBufferedImage();

		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ImageIO.write(asBufferedImage, "png", baos);
		baos.flush();
		byte[] imageInByte = baos.toByteArray();
		baos.close();

		if (file.exists()) {
			file.delete();
		}
		
		return new String(Base64.encode(imageInByte));

	}

	public static String mergeImage(String ImageAString, String ImageBString) {
		try {

			byte[] decodeA = Base64.decode(ImageAString);
			byte[] decodeB = Base64.decode(ImageBString);

			ByteArrayInputStream bisA = new ByteArrayInputStream(decodeA);
			BufferedImage imageA = ImageIO.read(bisA);

			ByteArrayInputStream bisB = new ByteArrayInputStream(decodeB);
			BufferedImage imageB = ImageIO.read(bisB);

			// Initializing the final image
			BufferedImage finalImg = new BufferedImage(imageA.getWidth(),
					imageA.getHeight() + imageB.getHeight(), imageA.getType());

			finalImg.createGraphics().drawImage(imageA, 0, 0, null);
			finalImg.createGraphics().drawImage(imageB, 0, imageA.getHeight(),
					null);

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(finalImg, "png", baos);
			baos.flush();
			byte[] imageInByte = baos.toByteArray();
			baos.close();

			String asBase64 = new String(Base64.encode(imageInByte));

			return asBase64;
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ImageBString;
	}

	public static String getPdfInBase64(String filePath) {
		try {
			File file = new File(filePath);
			if (!file.exists()) {
				return null;
			}
			FileInputStream fileInputStream = null;

			byte[] bFile = new byte[(int) file.length()];

			fileInputStream = new FileInputStream(file);
			fileInputStream.read(bFile);
			fileInputStream.close();

			for (int i = 0; i < bFile.length; i++) {
				System.out.print((char) bFile[i]);
			}

			return new String(Base64.encode(bFile));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String getImage(String imageId, String filePath) {
		try {
			File file = new File(filePath, imageId + ".json");
			if (!file.exists()) {
				return null;
			}
			BufferedReader reader = new BufferedReader(new FileReader(file));
			String line = null;
			StringBuilder stringBuilder = new StringBuilder();
			String ls = System.getProperty("line.separator");

			while ((line = reader.readLine()) != null) {
				stringBuilder.append(line);
				stringBuilder.append(ls);
			}

			reader.close();

			return stringBuilder.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void saveImage(String imageId, String imageString,
			String filePath) {
		FileOutputStream fop = null;
		File file;

		try {

			file = new File(filePath, imageId + ".json");
			fop = new FileOutputStream(file);

			// if file doesnt exists, then create it
			if (!file.exists()) {
				file.createNewFile();
			}

			// get the content in bytes
			byte[] contentInBytes = imageString.getBytes();

			fop.write(contentInBytes);
			fop.flush();
			fop.close();

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (fop != null) {
					fop.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}