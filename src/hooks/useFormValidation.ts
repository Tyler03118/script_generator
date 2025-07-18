import { useState, useCallback, useRef } from 'react';
import type { ScriptType, SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData } from '../types';

export interface UseFormValidationReturn {
  formData: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null;
  isFormValid: boolean;
  triggerValidation: boolean;
  handleDataChange: (data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => void;
  handleValidationChange: (isValid: boolean) => void;
  setTriggerValidation: (trigger: boolean) => void;
  resetForm: () => void;
}

export const useFormValidation = (
  onFormDataChange?: (data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null) => void
): UseFormValidationReturn => {
  const [formData, setFormData] = useState<SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [triggerValidation, setTriggerValidation] = useState(false);
  
  // 使用ref来避免循环依赖
  const lastFormDataRef = useRef<string>('');
  const lastValidationRef = useRef<boolean>(false);

  const handleDataChange = useCallback((data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => {
    const dataString = JSON.stringify(data);
    
    // 只有当数据真正改变时才更新状态
    if (dataString !== lastFormDataRef.current) {
      lastFormDataRef.current = dataString;
      setFormData(data);
      
      // 通知外部组件表单数据变化
      if (onFormDataChange) {
        onFormDataChange(data);
      }
    }
  }, [onFormDataChange]);

  const handleValidationChange = useCallback((isValid: boolean) => {
    // 只有当验证状态真正改变时才更新
    if (isValid !== lastValidationRef.current) {
      lastValidationRef.current = isValid;
      setIsFormValid(isValid);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(null);
    setIsFormValid(false);
    setTriggerValidation(false);
    
    // 重置ref
    lastFormDataRef.current = '';
    lastValidationRef.current = false;
    
    // 通知外部组件表单数据重置
    if (onFormDataChange) {
      onFormDataChange(null);
    }
  }, [onFormDataChange]);

  return {
    formData,
    isFormValid,
    triggerValidation,
    handleDataChange,
    handleValidationChange,
    setTriggerValidation,
    resetForm,
  };
};