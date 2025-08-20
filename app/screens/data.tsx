import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../service/axiosInstance";

interface ProductFormData {
  productName: string;
  price: string;
  category: string;
  description: string;
  stock: string;
}

const { width } = Dimensions.get('window');

const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: "",
    price: "",
    category: "grocery",
    description: "",
    stock: "in-stock"
  });

  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [buttonScale] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories = [
    { label: "🛒 Grocery", value: "grocery" },
    { label: "🌸 Flower", value: "flower" },
    { label: "📱 Electronics", value: "electronics" },
    { label: "👕 Clothes", value: "clothes" }
  ];

  const stockOptions = [
    { label: "✅ In Stock", value: "in-stock" },
    { label: "❌ Out of Stock", value: "out-of-stock" }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof ProductFormData, value: string) => {
    setFormData({ ...formData, [key]: value });
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: undefined });
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async () => {
    animateButton();
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
      });

      if (!result.canceled) {
        setSelectedImages([...selectedImages, ...result.assets]);
        Alert.alert("Success", `${result.assets.length} image(s) added!`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill in all required fields correctly");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Images Required", "Please select at least one image for the product");
      return;
    }

    setIsLoading(true);
    animateButton();

    try {
      const form = new FormData();
      form.append("productName", formData.productName);
      form.append("price", formData.price);
      form.append("category", formData.category);
      form.append("description", formData.description);
      form.append("stock", formData.stock);

      selectedImages.forEach((img, index) => {
        const uriParts = img.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        form.append("images", {
          uri: img.uri,
          name: `photo_${index}.${fileType}`,
          type: `image/${fileType}`
        } as any);
      });

      const res = await axiosInstance.post("/products", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setFormData({
        productName: "",
        price: "",
        category: "grocery",
        description: "",
        stock: "in-stock"
      });
      setSelectedImages([]);
setErrors({});

      
      console.log("Created:", res.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert("❌ Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    key: keyof ProductFormData,
    placeholder: string,
    keyboardType: "default" | "numeric" = "default",
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          focusedInput === key && styles.inputFocused,
          errors[key] && styles.inputError,
          multiline && styles.textArea
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        value={formData[key]}
        onChangeText={(text) => handleChange(key, text)}
        onFocus={() => setFocusedInput(key)}
        onBlur={() => setFocusedInput("")}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>✨ ADD New Product</Text>
          <Text style={styles.subheading}>Fill in the details below</Text>
        </View>

        <View style={styles.form}>
          {renderInput("productName", "📦 Product Name")}
          {renderInput("price", "💰 Price ($)", "numeric")}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>📂 Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(itemValue) => handleChange("category", itemValue)}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                ))}
              </Picker>
            </View>
          </View>

          {renderInput("description", "📝 Product Description", "default", true)}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>📊 Stock Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.stock}
                onValueChange={(itemValue) => handleChange("stock", itemValue)}
                style={styles.picker}
              >
                {stockOptions.map((status) => (
                  <Picker.Item key={status.value} label={status.label} value={status.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.label}>📸 Product Images</Text>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.imagePicker, selectedImages.length > 0 && styles.imagePickerActive]}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Text style={styles.imagePickerText}>
                  {selectedImages.length > 0 ? "📷 Add More Images" : "📷 Select Images"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreview}>
                {selectedImages.map((img, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: img.uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>🚀 Add your Product</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
  },
  subheading: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 4,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e1e8ed",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#2c3e50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#3498db",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: "#e1e8ed",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: "#2c3e50",
  },
  imageSection: {
    marginBottom: 30,
  },
  imagePicker: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#3498db",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imagePickerActive: {
    backgroundColor: "#2980b9",
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#27ae60",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#95a5a6",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductForm;